import { Router } from 'express'
import {
  bookmarkTweetController,
  unBookmarkTweetByBookmarkIdController,
  unBookmarkTweetController
} from '~/controllers/bookmarks.controller'
import {
  getTweetUserLikedController,
  likeTweetController,
  unlikeTweetByLikeIdController,
  unlikeTweetController
} from '~/controllers/likes.controller'
import { paginationNavigator, tweetIdValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUSerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handles'

const likesRouter = Router()

/**
 * Description: Get Tweet User Liked
 * Path: /
 * Method: GET
 * Header:{Authorization:Bearer <access_token>}
 * Body:
 * **/
likesRouter.get(
  '',
  accessTokenValidator,
  verifiedUSerValidator,
  paginationNavigator,
  wrapRequestHandler(getTweetUserLikedController)
)
/**
 * Description: Create Like
 * Path: /
 * Method: POST
 * Header:{Authorization:Bearer <access_token>}
 * Body: {tweet_id:string}
 * **/
likesRouter.post(
  '',
  accessTokenValidator,
  verifiedUSerValidator,
  tweetIdValidator,
  wrapRequestHandler(likeTweetController)
)
/**
 * Description: Delete Like
 * Path: /tweets/:tweet_id
 * Method: DELETE
 * Header:{Authorization:Bearer <access_token>}
 * **/
likesRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUSerValidator,
  tweetIdValidator,
  wrapRequestHandler(unlikeTweetController)
)

/**
 * Description: Delete Like
 * Path: /:like_id
 * Method: DELETE
 * Header:{Authorization:Bearer <access_token>}
 * **/
likesRouter.delete(
  '/:like_id',
  accessTokenValidator,
  verifiedUSerValidator,
  tweetIdValidator,
  wrapRequestHandler(unlikeTweetByLikeIdController)
)
export default likesRouter
