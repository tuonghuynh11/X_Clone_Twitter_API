import { TweetAudience, TweetType } from '~/constants/enums'
import { Media } from '../Other'
import { ParamsDictionary, Query } from 'express-serve-static-core'
import Tweet from '../schemas/Tweet.schema'
import User from '../schemas/User.schema'

export interface TweetRequestBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string //  chỉ null khi tweet gốc, không thì là tweet_id cha dạng string
  hashtags: string[] // tên của hashtag dạng ['javascript', 'reactjs']
  mentions: string[] // user_id[]
  medias: Media[]
}

export interface TweetParam extends ParamsDictionary {
  tweet_id: string
}
export interface TweetQuery extends Pagination, Query {
  tweet_type: string
}
export interface Pagination {
  page: string
  limit: string
}

export interface NewFeed extends Tweet {
  user: User
  bookmarks: number
  likes: number
  retweet_count: number
  comment_count: number
  quote_count: number
}
export interface NewFeedQuery extends Pagination, Query {
  isForYou: string
}
