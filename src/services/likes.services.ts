import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Like from '~/models/schemas/Likes.schema'

class LikeService {
  async likeTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.likes.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Like({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return result
  }
  async unLikeTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.likes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
    return result
  }
  async unLikeTweetByBookmarkId(like_id: string) {
    const result = await databaseService.likes.findOneAndDelete({
      _id: new ObjectId(like_id)
    })
    return result
  }
}

const likeService = new LikeService()
export default likeService
