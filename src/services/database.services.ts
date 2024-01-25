import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Follower from '~/models/schemas/Follower.schema'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Bookmark from '~/models/schemas/Bookmarks.schema'
import Like from '~/models/schemas/Likes.schema'
import Conversation from '~/models/schemas/Conversations.schema'
import { envConfig } from '~/constants/config'
const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@twitter.edfvckz.mongodb.net/?retryWrites=true&w=majority`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
  }
  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Database Error:', error)
    }
  }
  async createIndexes() {
    await Promise.all([
      this.indexUsers(),
      this.indexRefreshTokens(),
      this.indexVideoStatus(),
      this.indexFollowers(),
      this.indexTweets()
    ])
  }
  async indexUsers() {
    const exists = await this.users.indexExists(['email_1', 'email_1_password_1', 'username_1'])
    if (!exists) {
      this.users.createIndex({
        email: 1,
        password: 1
      })
      this.users.createIndex(
        {
          email: 1
        },
        { unique: true }
      )
      this.users.createIndex(
        {
          username: 1
        },
        { unique: true }
      )
    }
  }
  async indexRefreshTokens() {
    const exists = await this.refreshTokens.indexExists(['exp_1', 'token_1'])
    if (!exists) {
      this.refreshTokens.createIndex({
        token: 1
      })
      //Xóa index cho document nếu refreshToken hết hạn
      this.refreshTokens.createIndex(
        {
          exp: 1
        },
        {
          expireAfterSeconds: 0
        }
      )
    }
  }
  async indexVideoStatus() {
    const exists = await this.videoStatus.indexExists(['name_1'])
    if (!exists) {
      this.videoStatus.createIndex({
        name: 1
      })
    }
  }
  async indexFollowers() {
    const exists = await this.followers.indexExists(['followed_user_id_1', 'user_id_1', 'user_id_1_followed_user_id_1'])
    if (!exists) {
      this.followers.createIndex({
        user_id: 1,
        followed_user_id: 1
      })
      this.followers.createIndex({
        user_id: 1
      })
      this.followers.createIndex({
        followed_user_id: 1
      })
    }
  }
  async indexTweets() {
    const exists = await this.tweets.indexExists(['content_text'])
    if (!exists) {
      this.tweets.createIndex(
        {
          content: 'text'
        },
        { default_language: 'none' }
      )
    }
  }
  get users(): Collection<User> {
    return this.db.collection(envConfig.dbUsersCollection as string)
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.dbRefreshTokensCollection as string)
  }
  get followers(): Collection<Follower> {
    return this.db.collection(envConfig.dbFollowersCollection as string)
  }
  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(envConfig.dbVideoStatusCollection as string)
  }
  get tweets(): Collection<Tweet> {
    return this.db.collection(envConfig.dbTweetsCollection as string)
  }
  get hashtags(): Collection<Hashtag> {
    return this.db.collection(envConfig.dbHashtagsCollection as string)
  }
  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(envConfig.dbBookmarksCollection as string)
  }
  get likes(): Collection<Like> {
    return this.db.collection(envConfig.dbLikesCollection as string)
  }
  get conversations(): Collection<Conversation> {
    return this.db.collection(envConfig.dbConversationCollection as string)
  }
}

// Tạo Object từ class DatabaseService

const databaseService = new DatabaseService()
export default databaseService
