import { connectMongoDB } from "./config/mongoDB.config.js"
import User from "./models/User.model.js"
import userRepository from "./repository/user.repository.js"
import express from 'express'
import testRouter from "./routes/test.router.js"
import authRouter from "./routes/auth.router.js"
import mail_transporter from "./config/mail.config.js"
import ENVIRONMENT from "./config/environment.config.js"
import randomMiddleware from "./middlewares/random.middleware.js"
import cors from 'cors'
import workspaceRepository from "./repository/workspace.repository.js"

connectMongoDB()

//Crear un servidor web (Express app)
const app = express()

/* 
Esto permite que otras direcciones distintas a la nuesta puedan consultar nuestro servidor
*/
app.use(cors())

//Habilita a mi servidor a recibir json por body
/* 
lee el request.headers.['content-type'] y si el valor es 'application/json' entonces guarda en request.body el json transformado
*/
app.use(express.json())


app.use('/api/test', testRouter)
app.use("/api/auth", authRouter)


app.get(
    '/api/suerte/saber', 
    randomMiddleware,
    (request, response) =>{
        if(request.suerte){
            response.send('Tenes suerte')
        }
        else{
            response.send('No tenes suerte')
        }
    }
)


app.listen(
    8080, 
    () => {
        console.log('Nuestra app se escucha en el puerto 8080')
    }
)

