import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BOOKMARKS_MESSAGES } from '~/constants/messages'
import { BookmarkTweetRequestBody } from '~/models/requests/Bookmark.requests'
import { Pagination } from '~/models/requests/Tweet.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import bookmarkService from '~/services/bookmarks.services'

export const getBookmarkController = async (req: Request<ParamsDictionary, any, Pagination>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { tweets, total } = await bookmarkService.getBookmarks({ user_id, limit, page })
  return res.json({
    message: BOOKMARKS_MESSAGES.GET_BOOKMARKS_SUCCESSFULLY,
    result: {
      tweets: tweets,
      page: page,
      limit: limit,
      total_items: total,
      total_pages: Math.ceil(total / limit)
    }
  })
}

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
