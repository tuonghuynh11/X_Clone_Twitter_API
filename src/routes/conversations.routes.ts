import { Router } from 'express'
import { getConversationsByReceiverIdController } from '~/controllers/conservations.controllers'
import { paginationNavigator } from '~/middlewares/tweets.middlewares'

import { accessTokenValidator, getConversationsValidator, verifiedUSerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handles'

const conversationsRouter = Router()

/**
 * Description: GET Conversation by receiver_id
 * Path: /receiver/:receiverId
 * Method: GET
 * Header:{Authorization:Bearer <access_token>}
 * **/
conversationsRouter.get(
  '/receivers/:receiver_id',
  accessTokenValidator,
  verifiedUSerValidator,
  paginationNavigator,
  getConversationsValidator,
  wrapRequestHandler(getConversationsByReceiverIdController)
)

export default conversationsRouter
