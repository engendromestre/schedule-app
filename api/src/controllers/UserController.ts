import { NextFunction, Request, Response } from 'express'
import { UserService } from '../services/UserService'

class UsersController {
    private userService: UserService

    constructor() {
        this.userService = new UserService()
    }

    index() {}

    show() {}

    async store(request: Request, response: Response, next: NextFunction) {
        const { name, email, password } = request.body
        try {
            const result = await this.userService.create({
                name,
                email,
                password,
            })
            return response.status(201).json(result) //status code de criação de registro
        } catch (error) {
            next(error)
        }
    }

    auth() {}

    async update(request: Request, response: Response, next: NextFunction) {
        const { name, oldPassword, newPassword } = request.body
        try {
            const result  = await this.userService.update({ name, oldPassword, newPassword, avatar_url: request.file })
            return response.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }
}

export { UsersController }
