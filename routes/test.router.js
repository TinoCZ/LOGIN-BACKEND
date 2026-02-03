import express from 'express'
import testController from '../controllers/test.controller.js'
import authMiddleware from '../middlewares/auth.middlware.js'

const testRouter = express.Router()

//GET /api/test/
testRouter.get(
    '/', 
    testController.get
)

testRouter.get(
    '/authorized-test',
    authMiddleware,
    (request, response) => {
        console.log({user_data: request.user})
        return response.json(
            {
                ok: true, 
                status: 200,
                message: 'Test correcto',
                data: null
            }
        )
    }
)

export default testRouter


/* 
Implementar la capa de controller en el authRouter
*/