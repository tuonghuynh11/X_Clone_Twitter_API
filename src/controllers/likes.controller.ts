import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LIKES_MESSAGES } from '~/constants/messages'
import { LikeTweetRequestBody } from '~/models/requests/Like.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import likeService from '~/services/likes.services'
export const likeTweetController = async (req: Request<ParamsDictionary, any, LikeTweetRequestBody>, res: Response) => {
  const { tweet_id } = req.body
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeService.likeTweet(user_id, tweet_id)
  return res.json({
    message: LIKES_MESSAGES.LIKES_SUCCESSFULLY,
    result
  })
}
export const unlikeTweetController = async (req: Request, res: Response) => {
  const { tweet_id } = req.params
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeService.unLikeTweet(user_id, tweet_id)
  return res.json({
    message: LIKES_MESSAGES.UNLIKE_SUCCESSFULLY,
    result
  })
}
export const unlikeTweetByLikeIdController = async (req: Request, res: Response) => {
  const { like_id } = req.params
  const result = await likeService.unLikeTweetByBookmarkId(like_id)
  return res.json({
    message: LIKES_MESSAGES.UNLIKE_SUCCESSFULLY,
    result
  })
}
