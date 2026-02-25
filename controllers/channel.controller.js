import channelRepository from "../repository/channel.repository.js"

class ChannelController {
  async getAllByWorkspaceId(request, response) {
    const { workspace_id } = request.params;
    const channels = await channelRepository.getAllByWorkspaceId(workspace_id);
    response.json({
      status: 200,
      ok: true,
      message: "Canales obtenidos con exito",
      data: {
        channels,
      },
    });
  }

  async delete(request, response) {
    try {
      const { channel_id } = request.params;

      await channelRepository.delete(channel_id);

      return response.json({
        ok: true,
        message: "Canal eliminado correctamente",
        data: null,
        status: 200,
      });
    } catch (error) {
      console.log("Error deleting channel:", error);

      return response.json({
        ok: false,
        status: 500,
        message: "Error interno del servidor",
        data: null,
      });
    }
  }

  async create(request, response) {
    const { name } = request.body;
    const { workspace_id } = request.params;

    //Pueden validar el nombre

    const channel_created = await channelRepository.create(workspace_id, name);
    response.json({
      status: 201,
      ok: true,
      message: "Canal creado con exito",
      data: {
        channel_created,
      },
    });
  }
}




const channelController = new ChannelController()

export { channelController }