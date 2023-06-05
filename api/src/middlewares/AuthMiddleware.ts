import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

interface IPayload {
    sub: string
}

class AuthMiddleware {
    async auth(request: Request, response: Response, next: NextFunction) {
        const authHeader = request.headers.authorization
        if (!authHeader) {
            return response.status(401).json({
                code: 'token.missing',
                message: 'Token missing',
            })
        }
        //Authorization Bearer
        const [, token] = authHeader.split(' ')

        try {
            let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN
            if (!secretKey) {
                throw new Error('There is no token key')
            }
            const { sub } = verify(token, secretKey) as IPayload
            request.user_id = sub
            return next()
        } catch (error) {
            return response.status(401).json({
                code: 'token.expired',
                message: 'Token expired.',
            })
        }
    }
}

export { AuthMiddleware }
