import { ObjectId } from 'mongodb'
import databaseService from './database.services'

class ConversationsService {
  async getConversations({
    sender_id,
    receiver_id,
    limit,
    page
  }: {
    sender_id: string
    receiver_id: string
    limit: number
    page: number
  }) {
    console.log('sender_id: ', sender_id)
    console.log('receiver_id:', receiver_id)
    const match = {
      $or: [
        { sender_id: new ObjectId(sender_id), receiver_id: new ObjectId(receiver_id) },
        { sender_id: new ObjectId(receiver_id), receiver_id: new ObjectId(sender_id) }
      ]
    }
    const [conversations, total] = await Promise.all([
      await databaseService.conversations
        .find(match)
        .skip(limit * (page - 1))
        .limit(limit)
        .sort('created_at', -1)
        .toArray(),
      await databaseService.conversations.countDocuments(match)
    ])

    return { conversations, total }
  }
}

const conversationsService = new ConversationsService()
export default conversationsService
