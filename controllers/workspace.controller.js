import ENVIRONMENT from "../config/environment.config.js"
import mail_transporter from "../config/mail.config.js"
import ServerError from "../helpers/error.helpers.js"
import userRepository from "../repository/user.repository.js"
import workspaceRepository from "../repository/workspace.repository.js"

import jwt from 'jsonwebtoken'

class WorkspaceController {
    async getWorkspaces(request, response) {
        //Quiero obtener los espacios de trabajo asociados al cliente que hace la consulta
        //request.user
        const user_id = request.user.id
        const workspaces = await workspaceRepository.getWorkspacesByUserId(user_id)
        response.json({
            ok: true,
            data: {
                workspaces
            }
        })
    }

    async create(request, response) {
        const { title, image, description } = request.body
        const user_id = request.user.id
        const workspace = await workspaceRepository.create(user_id, title, image, description)
        await workspaceRepository.addMember(workspace._id, user_id, 'owner')
        response.json({
            ok: true,
            data: {
                workspace
            }
        })
    }


    async delete(request, response) {
        try {
            const user_id = request.user.id
            const { workspace_id } = request.params

            const workspace_selected = await workspaceRepository.getById(workspace_id)
            if (!workspace_selected) {
                throw new ServerError('No existe ese espacio de trabajo', 404)
            }
            const member_info = await workspaceRepository.getMemberByWorkspaceIdAndUserId(workspace_id, user_id)
            if (member_info.role !== 'owner') {
                throw new ServerError('No tienes permiso para eliminar este espacio de trabajo', 403)
            }
            await workspaceRepository.delete(workspace_id)
            response.json({
                ok: true,
                message: 'Espacio de trabajo eliminado correctamente',
                data: null,
                status: 200
            })
        }
        catch (error) {
            /* Si tiene status decimos que es un error controlado (osea es esperable) */
            if (error.status) {
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

    async addMemberRequest(request, response) {
        try {
            const {email, role} = request.body
            const workspace = request.workspace

            console.log({workspace})
            const user_to_invite = await userRepository.buscarUnoPorEmail(email)
            if(!user_to_invite){
                throw new ServerError('El email del invitado no existe.', 404)
            }

            const already_member = await workspaceRepository.getMemberByWorkspaceIdAndUserId(workspace._id, user_to_invite._id)


            if(already_member){
                throw new ServerError('El usuario ya es miembro de este espacio de trabajo', 400)
            }

            const token = jwt.sign(
                {
                    id: user_to_invite._id,
                    email,
                    workspace: workspace._id,
                    role
                },
                ENVIRONMENT.JWT_SECRET_KEY
            )

            await mail_transporter.sendMail(
                {
                    to: email,
                    from: ENVIRONMENT.GMAIL_USERNAME,
                    subject: `Has sido invitado a ${workspace.title}`,
                    html: `
                        <h1>Has sido invitado a participar en el espacio de trabajo: ${workspace.title}</h1>
                        <p>Si no reconoces esta invitacion por favor desestima este mail</p>
                        <p>Da click a 'aceptar invitacion' para aceptar la invitacion</p>
                        <a
                        href='${ENVIRONMENT.URL_BACKEND}/api/workspace/${workspace._id}/members/accept-invitation?invitation_token=${token}'
                        >Aceptar invitacion</a>
                    `
                }
            )

            return response.json(
                {
                    status: 201,
                    ok: true, 
                    message: "invitacion enviada",
                    data: null
                }
            )

        }
        catch (error) {
            console.log("Error en addMember", error)
            /* Si tiene status decimos que es un error controlado (osea es esperable) */
            if (error.status) {
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

    async acceptInvitation (request, response){
        try{
            const {invitation_token} = request.query

            const payload = jwt.verify(invitation_token, ENVIRONMENT.JWT_SECRET_KEY)
            const {id, workspace: workspace_id, role} = payload 
            await workspaceRepository.addMember(workspace_id, id, role)

            response.redirect(`${ENVIRONMENT.URL_FRONTEND}`)

        }
        catch(error){
            console.log({error})
            /* Si tiene status decimos que es un error controlado (osea es esperable) */
            if (error.status) {
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

    async getWorkspaceById(req, res) {
        try{
            const workspace = req.workspace
            const member = req.member

            return res.json({
                ok: true,
                data: {
                    workspace,
                    membership: {
                        role: member.role
                    }
                }
            })
        }
        catch (error){
            if (error.status) {
                return res.json({
                    ok: false,
                    status: error.status,
                    message: error.message,
                    data: null
                })
            }

            return res.json({
                ok: false,
                status: 500,
                message: "Error interno del servidor",
                data: null
            })

        }
    }
}

const workspaceController = new WorkspaceController()
export default workspaceController