import { ObjectId } from 'mongodb'

interface NotificationType {
  _id?: ObjectId
  message: string
  owner_username: string
  interacted_username: string
  tweet_id: ObjectId
  children_tweet?: ObjectId | null
  created_at?: Date
}

export default class Notification {
  _id?: ObjectId
  message: string
  owner_username: string
  interacted_username: string
  tweet_id: ObjectId
  children_tweet?: ObjectId | null
  created_at?: Date
  constructor({
    _id,
    message,
    owner_username,
    interacted_username,
    tweet_id,
    children_tweet,
    created_at
  }: NotificationType) {
    this._id = _id || new ObjectId()
    this.message = message
    this.owner_username = owner_username
    this.interacted_username = interacted_username
    this.tweet_id = tweet_id
    this.children_tweet = children_tweet
    this.created_at = created_at || new Date()
  }
}
