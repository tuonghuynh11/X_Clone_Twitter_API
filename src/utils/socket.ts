import { Server } from 'socket.io'
import { UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { verifyAccessToken } from './commons'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import Conversation from '~/models/schemas/Conversations.schema'
import { ObjectId } from 'mongodb'
import * as HTTP_SERVER from 'http'

export const initSocket = (httpServer: HTTP_SERVER.Server) => {
  //Server instance
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000'
    }
  })

  const users = new Map<string, { socket_id: string }>()
  //Middleware khi user chưa kết nối thành công vào socket
  io.use(async (socket, next) => {
    const { Authorization } = socket.handshake.auth
    const access_token = Authorization?.split(' ')[1]
    try {
      const decoded_authorization = await verifyAccessToken(access_token as string)
      const { verify } = decoded_authorization as TokenPayload
      if (verify !== UserVerifyStatus.Verified) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.USER_NOT_VERIFIED,
          status: HTTP_STATUS.FORBIDDEN
        })
      }
      //Truyền decoded_authorization vào socket để sử dụng ở các middlewares khác
      socket.handshake.auth.decoded_authorization = decoded_authorization
      socket.handshake.auth.access_token = access_token
      next()
    } catch (error) {
      next({
        message: 'Unauthorized',
        name: 'unauthorizedError',
        data: error
      })
    }
  })

  io.on('connection', (socket) => {
    console.log('user connected:', socket.id)
    const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
    users.set(user_id, { socket_id: socket.id })
    console.log(users)

    socket.use(async (packet, next) => {
      const { access_token } = socket.handshake.auth as TokenPayload
      try {
        await verifyAccessToken(access_token as string)
        next()
      } catch (error) {
        next(new Error('Unauthorized'))
      }
    })
    socket.on('error', (error) => {
      if (error.message === 'Unauthorized') {
        socket.disconnect()
      }
    })

    socket.on('send_message', async (data) => {
      const { content, sender_id, receiver_id } = data.payload
      const receiver_socket_id = users.get(receiver_id)?.socket_id as string

      const conversation = new Conversation({
        sender_id: new ObjectId(sender_id),
        receiver_id: new ObjectId(receiver_id),
        content: content
      })

      const result = await databaseService.conversations.insertOne(conversation)
      conversation._id = result.insertedId
      if (receiver_socket_id) {
        socket.to(receiver_socket_id).emit('receive_message', {
          payload: conversation
        })
      }
    })

    socket.on('disconnect', () => {
      users.delete(user_id)
      // delete users[user_id]
      console.log(`user ${socket.id} disconnected`)
    })
  })
}
export default initSocket
