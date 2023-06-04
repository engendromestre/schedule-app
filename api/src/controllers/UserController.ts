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
            const result = await this.userService.create({ name, email, password })
            return response.status(201).json(result) //status code de criação de registro
        } catch (error) {
            next(error)
        }
    }

    auth() {}
}

export { UsersController }
