import { compare, hash } from 'bcrypt'
import { ICreate, IUpdate } from '../interfaces/UserInterface'
import { UserRepository } from '../repositories/UserRepository'
import { s3 } from '../config/aws'
import { v4 as uuid } from 'uuid'
import { sign, verify } from 'jsonwebtoken'

class UserService {
    private userRepository: UserRepository

    constructor() {
        this.userRepository = new UserRepository()
    }

    async create({ name, email, password }: ICreate) {
        const findUser = await this.userRepository.findUserByEmail(email)

        if (findUser) {
            throw new Error('User exists')
        }

        const hashPassword = await hash(password, 10)

        const create = await this.userRepository.create({
            name,
            email,
            password: hashPassword,
        })

        return create
    }

    private validateSecretKey(msg_error: string, keyType: string) {
        let secretKey: string | undefined =
            keyType === 'token'
                ? process.env.ACCESS_KEY_TOKEN
                : process.env.ACCESS_KEY_TOKEN_REFRESH
        if (!secretKey) {
            throw new Error(msg_error)
        }
        return secretKey
    }

    async auth(email: string, password: string) {
        const findUser = await this.userRepository.findUserByEmail(email)
        if (!findUser) {
            // E-mail not found
            throw new Error('User or password invalid')
        }
        const passwordMatch = await compare(password, findUser.password)
        if (!passwordMatch) {
            // E-mail not found
            throw new Error('Password invalid')
        }

        let secretKey = this.validateSecretKey('There is no token key', 'token')
        const token = sign({ email }, secretKey, {
            subject: findUser.id,
            expiresIn: '1d',
        })

        let secretKeyRefreshToken = this.validateSecretKey(
            'There is no token key',
            'refresh_token'
        )
        const refreshToken = sign({ email }, secretKeyRefreshToken, {
            subject: findUser.id,
            expiresIn: '7d',
        })

        return {
            token,
            refresh_token: refreshToken,
            user: {
                name: findUser.name,
                email: findUser.email,
            },
        }
    }

    async refresh(refresh_token: string) {
        if (!refresh_token) {
            throw new Error('Refresh token missing')
        }

        let secretKey = this.validateSecretKey(
            'There is no refresh token key',
            'token'
        )
        let secretKeyRefresh = this.validateSecretKey(
            'There is no refresh token key',
            'refresh_token'
        )
        const verifyRefreshToken = verify(refresh_token, secretKeyRefresh)
        const { sub } = verifyRefreshToken
        const newToken = sign({ sub }, secretKey, {
            expiresIn: '1h',
        })
        const refreshToken = sign({ sub }, secretKeyRefresh, {
            expiresIn: '7d',
        })
        return { token: newToken, refresh_token: refreshToken }
    }

    async update({
        name,
        oldPassword,
        newPassword,
        avatar_url,
        user_id,
    }: IUpdate) {
        const findUser = await this.userRepository.findUserByID(user_id)
        if (!findUser) {
            throw new Error('User not found')
        }
        let password
        if (oldPassword && newPassword) {
            const passwordMatch = compare(oldPassword, findUser.password)
            if (!passwordMatch) {
                throw new Error('Password invalid')
            }
            password = await hash(newPassword, 10)
            await this.userRepository.updatePassword(password, user_id)
        }
        if (avatar_url) {
            const uploadImg = avatar_url?.buffer
            const uploadS3 = await s3
                .upload({
                    Bucket: 'engendro-bucket',
                    Key: `${uuid()}-${avatar_url?.originalname}`,
                    Body: uploadImg,
                })
                .promise()
            if (!name) {
                name = findUser.name
            }
            await this.userRepository.update(name, uploadS3.Location, user_id)
        }
        return {
            message: 'User updated successfully',
        }
    }
}

export { UserService }
