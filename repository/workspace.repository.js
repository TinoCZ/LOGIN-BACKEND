import MemberWorkspace from "../models/MemberWorkspace.model.js";
import Workspace from "../models/Workspace.model.js";

class WorkspaceRepository {

    async getById (workspace_id){
        return await Workspace.findById(workspace_id)
    }
    async getWorkspacesByUserId(user_id){
        //Busco a todos los miembros que pertenezcan al usuario
        //Esto seria buscar todas mis membresias
        const workspaces = await MemberWorkspace.find({fk_id_user: user_id})
        .populate({
            path: 'fk_id_workspace',
            match: {active: true}
        }) //Esto permite expandir sobre la referencia a la tabla de espacios de trabajo


        return workspaces.filter((member) => member.fk_id_workspace !== null) //Eliminamos los null
    }
    async create (fk_id_owner, title, image, description){
        const workspace = await Workspace.create({
            fk_id_owner,
            title,
            image,
            description
        })
        return workspace
    }

    async addMember (workspace_id, user_id, role){
        const member = await MemberWorkspace.create({
            fk_id_workspace: workspace_id,
            fk_id_user: user_id,
            role
        })
        return member
    }

    //Obtener miembro de un espacio de trabajo por id de espacio de trabajo y id de usuario
    async getMemberByWorkspaceIdAndUserId(workspace_id, user_id){
        const member = await MemberWorkspace.findOne({fk_id_workspace: workspace_id, fk_id_user: user_id})
        return member
    }

    async delete(workspace_id){
        await Workspace.findByIdAndUpdate(workspace_id, {active: false})
    }
}

const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository