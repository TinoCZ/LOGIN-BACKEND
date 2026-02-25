import ENVIRONMENT from "../config/environment.config.js"
import mail_transporter from "../config/mail.config.js"
import ServerError from "../helpers/error.helpers.js"
import userRepository from "../repository/user.repository.js"
import workspaceRepository from "../repository/workspace.repository.js"
import channelRepository from "../repository/channel.repository.js"
import jwt from 'jsonwebtoken'

class WorkspaceController {
    async getWorkspaces(request, response) {
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
    try {
        const { title, image, description } = request.body
        const user_id = request.user.id

        // 1️⃣ crear workspace
        const workspace = await workspaceRepository.create(
            user_id,
            title,
            image,
            description
        )

        // 2️⃣ agregar owner
        await workspaceRepository.addMember(
            workspace._id,
            user_id,
            'Owner'
        )

        // ⭐ 3️⃣ crear canal general automático
        await channelRepository.create(
            workspace._id,
            'canal-general'
        )

        response.json({
            ok: true,
            data: {
                workspace
            }
        })
    } catch (error) {
        console.log("Error creating workspace:", error)

        return response.json({
            ok: false,
            status: 500,
            message: "Error interno del servidor",
            data: null
        })
    }
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
            if (member_info.role !== 'Owner') {
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



            if (role === "Owner") {
  throw new ServerError("No se puede invitar como Owner", 403)
}

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
                       <div style="background-color:#f4f4f4; padding:40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="
            max-width:500px;
            margin:0 auto;
            background-color:#ffffff;
            padding:40px;
            border-radius:8px;
            box-shadow:0 4px 20px rgba(0,0,0,0.08);
            text-align:center;
        ">
            <img src="https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png" alt="Logo" style="width:40px; margin-bottom:20px;">

            <h1 style="
                font-size:22px;
                color:#1d1c1d;
                margin-bottom:16px;
                line-height: 1.3;
            ">
                Has sido invitado a participar en el espacio de trabajo: <br>
                <span style="color:#611f69;">${workspace.title}</span>
            </h1>

            <p style="
                font-size:15px;
                color:#616061;
                margin-bottom:24px;
                line-height: 1.5;
            ">
                ¡Hola! Un administrador te ha invitado a colaborar. <br>
                Haz clic en el botón de abajo para unirte al equipo.
            </p>

            <a 
                href='${ENVIRONMENT.URL_BACKEND}/api/workspace/${workspace._id}/members/accept-invitation?invitation_token=${token}'
                style="
                    display:inline-block;
                    padding:14px 30px;
                    background-color:#611f69;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:6px;
                    font-weight:700;
                    font-size:15px;
                "
            >
                Aceptar invitación
            </a>

            <div style="
                margin-top:40px;
                padding-top:20px;
                border-top:1px solid #eeeeee;
            ">
                <p style="
                    font-size:12px;
                    color:#999999;
                    line-height: 1.4;
                ">
                    Si no reconoces esta invitación o no esperabas este correo, 
                    por favor desestímalo. No se ha realizado ninguna acción en tu cuenta.
                </p>
            </div>
        </div>
    </div>
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

     async getById(request, response) {
        const { workspace, member } = request
        response.json({
            ok: true,
            status: 200,
            data: {
                workspace,
                member
            },
            message: 'Espacio de trabajo seleccionado'
        })
    }
}
const workspaceController = new WorkspaceController()
export default workspaceController