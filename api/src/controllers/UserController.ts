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

    async auth(request: Request, response: Response, next: NextFunction) {
        const { email, password } = request.body
        try {
            const result = await this.userService.auth(email, password)
            return response.json(result)
        } catch (error) {
            next(error)
        }
    }

    async refresh(request: Request, response: Response, next: NextFunction) {
        const { refresh_token } = request.body
        try {
            const result = await this.userService.refresh(refresh_token)
            return response.json(result)
        } catch (error) {
            next(error)
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const { name, oldPassword, newPassword } = request.body
        const { user_id } = request
        try {
            const result = await this.userService.update({
                name,
                oldPassword,
                newPassword,
                avatar_url: request.file,
                user_id,
            })
            return response.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }
}

export { UsersController }
