import express, { Application, NextFunction, Request, Response } from 'express'
import { UsersRoutes } from './routes/users.routes'

const app: Application = express()

app.use(express.json()) // converter saída de dados no formato json para trabalhar com a API REST
app.use(express.urlencoded({ extended: true })) // /param?Hello%20World - converte uma sequência em um formato codificado para URL

const usersRoutes = new UsersRoutes().getRoutes() //handler

app.use('/users', usersRoutes)

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        // se em alguma parte do código for lançado um erro - throw new Error
        if (err instanceof Error) {
            // client error
            response.status(400).json({
                message: err.message,
            })
        }
        //server error
        return response.status(500).json({
            message: 'Internal Server Error',
        })
    }
)

app.listen(3000, () => {
    console.log('Server is running')
})
