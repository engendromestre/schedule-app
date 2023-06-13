import { Router } from 'express' // responsável pelo redirecionamento de rotas
import { UsersController } from '../controllers/UserController'
import { upload } from '../config/multer'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'

class UsersRoutes {
    private router: Router
    private usersController: UsersController
    private authMiddleware: AuthMiddleware

    constructor() {
        this.router = Router()
        this.usersController = new UsersController()
        this.authMiddleware = new AuthMiddleware()
    }
    getRoutes() {
        // bind - o valor permanece no parâmetro
        this.router.post(
            '/',
            this.usersController.store.bind(this.usersController)
        )
        
        this.router.post(
            '/auth',
            this.usersController.auth.bind(this.usersController)
        )

        this.router.post(
            '/refresh',
            this.usersController.refresh.bind(this.usersController)
        )

        this.router.put(
            '/',
            this.authMiddleware.auth.bind(this.authMiddleware),
            upload.single('avatar_url'),
            this.usersController.update.bind(this.usersController)
        )

        return this.router
    }
}

export { UsersRoutes }
