import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CONVERSATIONS_MESSAGES } from '~/constants/messages'
import { GetConversationParam } from '~/models/requests/Conversation.requests'
import { Pagination } from '~/models/requests/Tweet.requests'
import conversationsService from '~/services/conversations.services'
export const getConversationsByReceiverIdController = async (
  req: Request<GetConversationParam, any, any, Pagination>,
  res: Response
) => {
  const { receiver_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const sender_id = req.decoded_authorization?.user_id as string
  const result = await conversationsService.getConversations({
    sender_id,
    receiver_id,
    limit: limit,
    page: page
  })
  return res.json({
    message: CONVERSATIONS_MESSAGES.GET_CONVERSATIONS_SUCCESSFULLY,
    conversations: result.conversations,
    page: page,
    limit: limit,
    total_items: result.total,
    total_pages: Math.ceil(result.total / limit)
  })
}
