import { Router } from 'express'
import { searchController } from '~/controllers/search.controller'
import { searchValidator } from '~/middlewares/search.middlewares'
import { paginationNavigator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUSerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handles'
const searchRouter = Router()

/**
 * Description: Search Tweet
 * Path: /
 * Method: GET
 * Header:{Authorization:Bearer <access_token>}
 * Body: {tweet_id:string}
 * **/
searchRouter.get(
  '/',
  accessTokenValidator,
  verifiedUSerValidator,
  paginationNavigator,
  searchValidator,
  wrapRequestHandler(searchController)
)

export default searchRouter
