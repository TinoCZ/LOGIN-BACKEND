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

/* mail_transporter.sendMail({
    from: ENVIRONMENT.GMAIL_USERNAME,
    to: ENVIRONMENT.GMAIL_USERNAME,
    subject: 'Probando nodemailer',
    html: `<h1>Probando nodemailer</h1>`
}) */


    /* 
//Quiero crear un espacio de trabajo de prueba
*/

/* */
// async function crearEspacioDeTrabajo (){

//     //Creo el espacio de trabajo de prueba
//     const workspace = await workspaceRepository.create(
//         '696d4cab00a24ff5369848f7', //Remplazen por su id
//         'test',
//         'https://images.ecestaticos.com/XBt9G5umGpid8S2dgQk2G5jGUow=/119x0:2001x1412/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F848%2Ff70%2F0d5%2F848f700d5a15920f020496a616af873a.jpg',
//         'Descripcion del espacio de trabajo'
//     )
//     //Me agrego como miembro
//     await workspaceRepository.addMember(workspace._id, '696d4cab00a24ff5369848f7', 'Owner')
// }

// crearEspacioDeTrabajo() 

/* 
1ero:
    Crear espacio de trabajo
    Agregar miembro

2do: Crear endpoint para obtener espacios de trabajo asociados al usuario
3ro: Probar con postman */