import mongoose from "mongoose";


/* Terminar de crear el modelo */
const workspaceSchema = new mongoose.Schema(
    {
        fk_id_owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', //Aca marcamos la "relacion"
            required: true
        },
        title: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
        description: {
            type: String
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        active: {
            type: Boolean,
            default: true
        }
    }
)

const Workspace = mongoose.model('Workspace', workspaceSchema)
export default Workspace

