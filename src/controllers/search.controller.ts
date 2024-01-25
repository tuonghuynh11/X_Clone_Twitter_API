import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { SEARCH_MESSAGES } from '~/constants/messages'
import { SearchQuery } from '~/models/requests/Search.requests'
import searchService from '~/services/search.services'
export const searchController = async (req: Request<ParamsDictionary, any, any, SearchQuery>, res: Response) => {
  const page = Number(req.query.page)
  const limit = Number(req.query.limit)
  const content = req.query.content
  const user_id = req.decoded_authorization?.user_id as string
  const { tweets, total } = await searchService.search({
    content,
    page,
    limit,
    media_type: req.query.media_type,
    people_follow: req.query.people_follow,
    user_id
  })
  return res.json({
    message: SEARCH_MESSAGES.SEARCH_SUCCESSFULLY,
    result: {
      tweets: tweets,
      page: page,
      limit: limit,
      total_items: total,
      total_pages: Math.ceil(total / limit)
    }
  })
}
