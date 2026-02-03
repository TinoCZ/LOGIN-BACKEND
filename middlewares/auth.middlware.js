
/* 
Los headers de una peticion se guardan en 
request.headers
Y es un objeto con datos de la consulta como: ip, user-agent, etc...
Headers suele tener ciertos nombres de propiedades definidos (convention) ej: 
'authorization': clave o token de sesion, 
'content-type': tipos de contenido de la peticion (json, xml, etc),
'x-api-key': clave de api
Nosotros en esta cursada veremos la estrategia de auth 'Bearer'
*/

/* 
Tomar el token que envie el cliente, verificar y determinar la sesion:
- Que exista
- Que sea valido
- Guardar datos de sesion en el request
*/

import jwt from 'jsonwebtoken'
import ENVIRONMENT from '../config/environment.config.js'
import ServerError from '../helpers/error.helpers.js'

function authMiddleware (request, response, next){
    try{
        /* Normalmente el token de auth se envia en el header 'Authorization' */
        /* 
        Se suele enviar en este formato:
        'authorization': 'Bearer <token>'
        */
        const authorization_header = request.headers.authorization
    
        if(!authorization_header){
            throw new ServerError('No autorizado', 401)
        }
    
        const auth_token = authorization_header.split(' ')[1]
    
        if(!auth_token){
            throw new ServerError('No autorizado', 401)
        }
    
        const user = jwt.verify(auth_token, ENVIRONMENT.JWT_SECRET_KEY)

        //Guardar los datos de sesion del usuario 
        /* 
        {username, email, id}
        */
        request.user = user
        next()
    }
    catch(error){
        if(error instanceof jwt.JsonWebTokenError){
            return response.json(
                {
                    ok: false,
                    status: 401,
                    message: "No autorizado",
                    data: null
                }
            )
        }

        /* Si tiene status decimos que es un error controlado (osea es esperable) */
        if(error.status){
            return response.json({
                status: error.status,
                ok: false,
                message: error.message,
                data: null
            })
        }

        return response.json({
            ok: false,
            status: 500,
            message: "Error interno del servidor",
            data: null
        })
    }
}

export default authMiddleware