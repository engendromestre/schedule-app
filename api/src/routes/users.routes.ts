import { Router } from 'express' // responsável pelo redirecionamento de rotas
import { UsersController } from '../controllers/UserController'

class UsersRoutes {
    private router: Router
    private usersController: UsersController

    constructor() {
        this.router = Router()
        this.usersController = new UsersController()
    }
    getRoutes() {
        // bind - o valor permanece no parâmetro
        this.router.post(
            '/',
            this.usersController.store.bind(this.usersController)
        )
        return this.router
    }
}

export { UsersRoutes }
