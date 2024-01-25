import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BOOKMARKS_MESSAGES } from '~/constants/messages'
import { BookmarkTweetRequestBody } from '~/models/requests/Bookmark.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import bookmarkService from '~/services/bookmarks.services'

export const bookmarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetRequestBody>,
  res: Response
) => {
  const { tweet_id } = req.body
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.bookmarkTweet(user_id, tweet_id)
  return res.json({
    message: BOOKMARKS_MESSAGES.BOOKMARKS_SUCCESSFULLY,
    result
  })
}

export const unBookmarkTweetController = async (req: Request, res: Response) => {
  const { tweet_id } = req.params
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.unBookmarkTweet(user_id, tweet_id)
  return res.json({
    message: BOOKMARKS_MESSAGES.UNBOOKMARKS_SUCCESSFULLY,
    result
  })
}
export const unBookmarkTweetByBookmarkIdController = async (req: Request, res: Response) => {
  const { bookmark_id } = req.params
  const result = await bookmarkService.unBookmarkTweetByBookmarkId(bookmark_id)
  return res.json({
    message: BOOKMARKS_MESSAGES.UNBOOKMARKS_SUCCESSFULLY,
    result
  })
}
