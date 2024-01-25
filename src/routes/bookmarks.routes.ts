import { Router } from 'express'
import {
  bookmarkTweetController,
  unBookmarkTweetByBookmarkIdController,
  unBookmarkTweetController
} from '~/controllers/bookmarks.controller'
import { tweetIdValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUSerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handles'

const bookmarksRouter = Router()

/**
 * Description: Create Bookmark
 * Path: /
 * Method: POST
 * Header:{Authorization:Bearer <access_token>}
 * Body: {tweet_id:string}
 * **/
bookmarksRouter.post(
  '',
  accessTokenValidator,
  verifiedUSerValidator,
  tweetIdValidator,
  wrapRequestHandler(bookmarkTweetController)
)
/**
 * Description: Delete Bookmark
 * Path: /tweets/:tweet_id
 * Method: DELETE
 * Header:{Authorization:Bearer <access_token>}
 * **/
bookmarksRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUSerValidator,
  tweetIdValidator,
  wrapRequestHandler(unBookmarkTweetController)
)

/**
 * Description: Delete Bookmark
 * Path: /:bookmark_id
 * Method: DELETE
 * Header:{Authorization:Bearer <access_token>}
 * **/
bookmarksRouter.delete(
  '/:bookmark_id',
  accessTokenValidator,
  verifiedUSerValidator,
  tweetIdValidator,
  wrapRequestHandler(unBookmarkTweetByBookmarkIdController)
)
export default bookmarksRouter
