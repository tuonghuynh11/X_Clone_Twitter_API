import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LIKES_MESSAGES } from '~/constants/messages'
import { LikeTweetRequestBody } from '~/models/requests/Like.requests'
import { Pagination } from '~/models/requests/Tweet.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import likeService from '~/services/likes.services'

export const getTweetUserLikedController = async (req: Request<ParamsDictionary, any, Pagination>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { tweets, total } = await likeService.getTweetUserLiked({ user_id, limit, page })
  return res.json({
    message: LIKES_MESSAGES.GET_TWEETS_LIKED_SUCCESSFULLY,
    result: {
      tweets: tweets,
      page: page,
      limit: limit,
      total_items: total,
      total_pages: Math.ceil(total / limit)
    }
  })
}

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
