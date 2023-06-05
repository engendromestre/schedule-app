import { Router } from 'express' // responsável pelo redirecionamento de rotas
import { UsersController } from '../controllers/UserController'
import { upload } from '../config/multer'

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
        this.router.put(
            '/',
            upload.single('avatar_url'),
            this.usersController.update.bind(this.usersController)
        )
        return this.router
    }
}

export { UsersRoutes }
