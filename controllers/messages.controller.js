import messagesRepository from "../repository/messages.repository.js"

class MessagesController {
    async create(request, response) {
        console.log("🔥 member en request:", request.member)
        console.log("🔥 body:", request.body)

        const { mensaje } = request.body 
        const member_id = request.member._id
        const { channel_id } = request.params

        await messagesRepository.create(member_id, mensaje, channel_id)

        return response.json({
            ok: true,
            status: 201,
            message: 'Mensaje creado con exito'
        })
    }

    async getByChannelId(request, response) {
        const { channel_id } = request.params
        const messages = await messagesRepository.getAllByChannelId(channel_id)
        return response.json(
            {
                ok: true,
                status: 200,
                message: 'Mensajes obtenidos con exito',
                data: {
                    messages
                }
            }
        )
    }
}

// export const createMessage = async (req, res) => {
//   try {
//     const { channel_id, content } = req.body
//     const user_id = req.user.user_id

//     const newMessage = await MessageModel.create({
//       channel_id,
//       user_id,
//       content
//     })

//     res.status(201).json({
//       ok: true,
//       message: newMessage
//     })
//   } catch (error) {
//     res.status(500).json({
//       ok: false,
//       message: "Error creating message"
//     })
//   }
// }

// export const getMessagesByChannel = async (req, res) => {
//   try {
//     const { channel_id } = req.params

//     const messages = await MessageModel.getByChannel(channel_id)

//     res.json({
//       ok: true,
//       messages
//     })
//   } catch (error) {
//     res.status(500).json({
//       ok: false,
//       message: "Error fetching messages"
//     })
//   }
// }



const messagesController = new MessagesController()

export default messagesController