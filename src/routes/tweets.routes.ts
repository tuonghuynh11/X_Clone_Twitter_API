import { Router } from 'express'
import {
  createTweetController,
  getNewFeedsController,
  getTweetChildrenController,
  getTweetController
} from '~/controllers/tweets.controllers'
import {
  audienceValidator,
  createTweetValidator,
  getTweetChildrenValidator,
  paginationNavigator,
  tweetIdValidator
} from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, isUserLoggedInValidator, verifiedUSerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handles'

const tweetsRouter = Router()

/**
 * Description: Create Tweet
 * Path: /
 * Method: POST
 * Header:{Authorization:Bearer <access_token>}
 *
 * Body: TweetRequestBody
 *
 * **/
tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUSerValidator,
  createTweetValidator,
  wrapRequestHandler(createTweetController)
)
/**
 * Description: Get Tweet Detail
 * Path: /:tweet_id
 * Method: GET
 * Header:{Authorization:Bearer <access_token>}
 *
 * Body: TweetRequestBody
 *
 * **/
tweetsRouter.get(
  '/:tweet_id',
  // accessTokenValidator,
  // verifiedUSerValidator,
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUSerValidator),
  audienceValidator,
  wrapRequestHandler(getTweetController)
)

/**
 * Description: Get Tweet Children
 * Path: /:tweet_id/children
 * Method: GET
 * Header:{Authorization:Bearer <access_token>}
 *
 * Query: {limit:number,page:number, tweet_type:number}
 *
 * **/
tweetsRouter.get(
  '/:tweet_id/children',
  // accessTokenValidator,
  // verifiedUSerValidator,
  tweetIdValidator,
  paginationNavigator,
  getTweetChildrenValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUSerValidator),
  audienceValidator,
  wrapRequestHandler(getTweetChildrenController)
)

/**
 * Description: Get new feed
 * Path: /:new-feeds
 * Method: GET
 * Header:{Authorization:Bearer <access_token>}
 *
 * Query: {limit:number,page:number}
 *
 * **/
tweetsRouter.get(
  '/',
  paginationNavigator,
  accessTokenValidator,
  verifiedUSerValidator,
  wrapRequestHandler(getNewFeedsController)
)

export default tweetsRouter
