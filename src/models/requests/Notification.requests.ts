import { TweetType } from '~/constants/enums'

export interface NotificationRequestBody {
  message: string
  owner_username: string
  interacted_username: string
  tweet_id: string
  children_tweet: string
}
