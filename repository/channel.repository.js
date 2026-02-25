import Channel from "../models/Channels.model.js"

class ChannelRepository {
    async create(workspace_id, name){
        return await Channel.create({name: name, fk_id_workspace: workspace_id})
    }

    async getAllByWorkspaceId(workspace_id){
        return await Channel.find({fk_id_workspace: workspace_id, active: true})
    }

    async getByIdAndWorkspaceId(channel_id, workspace_id){
        return await Channel.findOne({_id: channel_id, fk_id_workspace: workspace_id})
    }

    async delete(channel_id) {
  await Channel.findByIdAndUpdate(channel_id, { active: false })
}
}

const channelRepository = new ChannelRepository()
export default channelRepository
