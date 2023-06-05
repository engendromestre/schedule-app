import { hash } from 'bcrypt'
import { ICreate, IUpdate } from '../interfaces/UserInterface'
import { UserRepository } from '../repositories/UserRepository'
import { s3 } from '../config/aws'
import { v4 as uuid } from 'uuid'

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

    async update({ name, oldPassword, newPassword, avatar_url }: IUpdate)  {
        const uploadImg = avatar_url?.buffer
        const uploadS3 = await s3
            .upload({
                Bucket: 'engendro-bucket',
                Key: `${uuid()}-${avatar_url?.originalname}`,
                Body: uploadImg,
            })
            .promise()
        console.log('url_img => ', uploadS3.Location)
    }
}

export { UserService }
