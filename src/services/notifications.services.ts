import { ObjectId } from 'mongodb'
import { NotificationRequestBody } from '~/models/requests/Notification.requests'
import Notification from '~/models/schemas/Notifications.schema'
import databaseService from './database.services'

class NotificationService {
  async createNotification(user_id: string, body: NotificationRequestBody) {
    const { message, owner_username, interacted_username, tweet_id, children_tweet } = body
    const notification = new Notification({
      message,
      owner_username,
      interacted_username,
      tweet_id: new ObjectId(tweet_id),
      children_tweet: children_tweet ? new ObjectId(children_tweet) : null
    })
    const result = await databaseService.notifications.insertOne(notification)
    return result
  }
}

const notificationService = new NotificationService()
export default notificationService
