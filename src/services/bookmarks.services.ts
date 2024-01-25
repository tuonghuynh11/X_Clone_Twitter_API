import Bookmark from '~/models/schemas/Bookmarks.schema'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import { omit } from 'lodash'

class BookmarkService {
  async bookmarkTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.bookmarks.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Bookmark({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return {
      _id: result?._id
    }
  }

  async unBookmarkTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.bookmarks.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
    return result
  }
  async unBookmarkTweetByBookmarkId(bookmark_id: string) {
    const result = await databaseService.bookmarks.findOneAndDelete({
      _id: new ObjectId(bookmark_id)
    })
    return result
  }
}
const bookmarkService = new BookmarkService()
export default bookmarkService
