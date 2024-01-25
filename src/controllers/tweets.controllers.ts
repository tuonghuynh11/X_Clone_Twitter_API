import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetType } from '~/constants/enums'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { Pagination, TweetParam, TweetQuery, TweetRequestBody } from '~/models/requests/Tweet.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import tweetsService from '~/services/tweets.services'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetsService.createTweet(user_id, req.body)
  return res.json({
    message: TWEETS_MESSAGES.CREATE_TWEET_SUCCESSFULLY,
    result
  })
}
export const getTweetController = async (req: Request, res: Response) => {
  const result = await tweetsService.increaseView(req.params.tweet_id, req.decoded_authorization?.user_id)
  const tweet = {
    ...result,
    user_views: result.user_views,
    guest_views: result.guest_views,
    updated_at: result.updated_at
  }
  return res.json({
    message: TWEETS_MESSAGES.GET_TWEET_SUCCESSFULLY,
    result: tweet
  })
}
export const getTweetChildrenController = async (req: Request<TweetParam, any, any, TweetQuery>, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const tweet_type = Number(req.query.tweet_type) as TweetType
  const { tweet_id } = req.params

  const user_id = req.decoded_authorization?.user_id
  const { total, tweets } = await tweetsService.getTweetChildren({
    tweet_id,
    tweet_type,
    limit,
    page,
    user_id
  })
  return res.json({
    message: TWEETS_MESSAGES.GET_TWEET_SUCCESSFULLY,
    result: {
      tweets,
      page: page,
      limit: limit,
      tweet_type: tweet_type,
      total_items: total,
      total_pages: Math.ceil(total / limit)
    }
  })
}

export const getNewFeedsController = async (req: Request<ParamsDictionary, any, any, Pagination>, res: Response) => {
  const user_id = req.decoded_authorization?.user_id as string
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = await tweetsService.getNewFeeds({ user_id, limit, page })
  return res.json({
    message: TWEETS_MESSAGES.GET_NEW_FEED_SUCCESSFULLY,
    result: {
      tweets: result.tweets,
      page: page,
      limit: limit,
      total_items: result.total,
      total_pages: Math.ceil(result.total / limit)
    }
  })
}
