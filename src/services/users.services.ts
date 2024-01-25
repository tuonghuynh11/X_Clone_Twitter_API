import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody, UpdateMeReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import Follower from '~/models/schemas/Follower.schema'
import axios from 'axios'
import { envConfig } from '~/constants/config'
class UsersService {
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify: verify
      },
      privateKey: envConfig.jwtSecretAccessToken,
      options: {
        algorithm: 'HS256',
        expiresIn: envConfig.accessTokenExpiresIn
      }
    })
  }

  private signRefreshToken({ user_id, verify, exp }: { user_id: string; verify: UserVerifyStatus; exp?: number }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify: verify
      },
      privateKey: envConfig.jwtSecretRefreshToken,
      options: {
        algorithm: 'HS256',
        expiresIn: exp || envConfig.refreshTokenExpiresIn
      }
    })
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
        verify: verify
      },
      privateKey: envConfig.jwtSecretEmailVerifyToken,
      options: {
        algorithm: 'HS256',
        expiresIn: envConfig.emailVerifyTokenExpiresIn
      }
    })
  }
  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken,
        verify: verify
      },
      privateKey: envConfig.jwtSecretForgotPasswordToken,
      options: {
        algorithm: 'HS256',
        expiresIn: envConfig.forgotPasswordTokenExpiresIn
      }
    })
  }
  private signAccessTokenAndRefreshToken({
    user_id,
    verify,
    exp
  }: {
    user_id: string
    verify: UserVerifyStatus
    exp?: number
  }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify, exp })])
  }
  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: envConfig.jwtSecretRefreshToken as string
    })
  }
  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })

    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        username: `user${user_id.toString()}`,
        email_verify_token: email_verify_token,
        date_of_birth: new Date(payload.day_of_birth),
        password: hashPassword(payload.password)
      })
    )

    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ token: refresh_token, user_id: new ObjectId(user_id), iat, exp })
    )

    console.log('email_verify_token', email_verify_token)
    return { access_token, refresh_token }
  }
  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email: email })
    return Boolean(user)
  }
  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({ user_id, verify: verify })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ token: refresh_token, user_id: new ObjectId(user_id), iat, exp })
    )
    return { access_token, refresh_token }
  }
  private async getOauthGoogleToken(code: string) {
    const body = {
      code,
      client_id: envConfig.googleClientId,
      client_secret: envConfig.googleClientSecret,
      redirect_uri: envConfig.googleRedirectUri,
      grant_type: 'authorization_code'
    }
    const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return data as {
      access_token: string
      id_token: string
    }
  }
  private async getGoogleUserInfo(access_token: string, id_token: string) {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: 'Bearer ' + id_token
      }
    })
    return data as {
      id: string
      email: string
      verified_email: boolean
      name: string
      given_name: string
      family_name: string
      picture: string
      locale: string
    }
  }

  async oauth(code: string) {
    const { id_token, access_token } = await this.getOauthGoogleToken(code)
    const userInfo = await this.getGoogleUserInfo(access_token, id_token)

    if (!userInfo.verified_email) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.GMAIL_NOT_VERIFIED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    //Check email exist in database
    const user = await databaseService.users.findOne({ email: userInfo.email })
    //If email exist in database, login to application
    if (user) {
      const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
        user_id: user._id.toString(),
        verify: user.verify
      })
      const { iat, exp } = await this.decodeRefreshToken(refresh_token)

      await databaseService.refreshTokens.insertOne(
        new RefreshToken({ token: refresh_token, user_id: user._id, iat, exp })
      )
      return {
        access_token,
        refresh_token,
        newUser: 0,
        verify: user.verify
      }
    } else {
      //random string password
      const password = Math.random().toString(36).substring(2, 30)
      //không có thì tạo mới tài khoản
      const data = await this.register({
        name: userInfo.name,
        email: userInfo.email,
        password: hashPassword(password),
        confirm_password: hashPassword(password),
        day_of_birth: new Date().toISOString()
      })
      return {
        ...data,
        newUser: 1,
        verify: UserVerifyStatus.Unverified
      }
    }
  }
  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }
  async refreshToken({
    old_refresh_token,
    user_id,
    verify,
    exp
  }: {
    old_refresh_token: string
    user_id: string
    verify: UserVerifyStatus
    exp: number
  }) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({ user_id, verify, exp })
    const decoded_refresh_token = await this.decodeRefreshToken(refresh_token)

    await Promise.all([
      databaseService.refreshTokens.deleteOne({ token: old_refresh_token }),
      databaseService.refreshTokens.insertOne(
        new RefreshToken({
          token: refresh_token,
          user_id: new ObjectId(user_id),
          iat: decoded_refresh_token.iat,
          exp: decoded_refresh_token.exp
        })
      )
    ])
    return { access_token, refresh_token }
  }

  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessTokenAndRefreshToken({ user_id, verify: UserVerifyStatus.Verified }),
      databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
        {
          // $set: {
          //   email_verify_token: '',
          //   verify: UserVerifyStatus.Verified
          //   // updated_at: new Date() //Thời gian chạy câu lệnh này
          // },
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified,
            updated_at: '$$NOW' //Thời gian mà mongodb cập nhật
          }
          // $currentDate: {
          //   updated_at: true //Thời gian mà mongodb cập nhật
          // }
        }
      ])
    ])
    const [access_token, refresh_token] = token
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ token: refresh_token, user_id: new ObjectId(user_id), iat, exp })
    )
    return { access_token, refresh_token }
  }

  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified })
    console.log('Resend verify email: ', user_id)

    //Cập nhật lại email_verify_token trong document
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token: email_verify_token
        },
        $currentDate: {
          updated_at: true //Thời gian mà mongodb cập nhật
        }
      }
    )
    return {
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
    }
  }

  async forgotPassword({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify })
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          forgot_password_token: forgot_password_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    //Gửi email kèm đường link đến email người dùng: http://twitter.com/forgot-password?token=token

    console.log('forgot password token:', forgot_password_token)
    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }
  async resetPassword(user_id: string, password: string) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            password: hashPassword(password),
            forgot_password_token: '',
            updated_at: '$$NOW'
          }
        }
      ]
    )
    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
    }
  }
  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...(_payload as UpdateMeReqBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after', // Trả về giá trị mới
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }
  async getProfile(username: string) {
    const user = await databaseService.users.findOne(
      {
        username: username
      },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          verify: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    )
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return user
  }
  async follow(user_id: string, follower_user_id: string) {
    const follower = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(follower_user_id)
    })
    if (follower === null) {
      await databaseService.followers.insertOne(
        new Follower({
          user_id: new ObjectId(user_id),
          followed_user_id: new ObjectId(follower_user_id)
        })
      )
      return {
        message: USERS_MESSAGES.FOLLOW_SUCCESS
      }
    }
    return {
      message: USERS_MESSAGES.FOLLOWED
    }
  }
  async unFollow(user_id: string, follower_user_id: string) {
    const follower = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(follower_user_id)
    })
    //Không tìm thấy document follower nghĩa là chưa follow người này
    if (follower === null) {
      return {
        message: USERS_MESSAGES.ALREADY_UNFOLLOWED
      }
    }
    //Tìm thấy document follower nghĩa là đã follow người này
    //Tiến hành xóa

    await databaseService.followers.deleteOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(follower_user_id)
    })
    return {
      message: USERS_MESSAGES.UNFOLLOW_SUCCESS
    }
  }
  async changePassword(user_id: string, new_password: string) {
    await databaseService.followers.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          password: hashPassword(new_password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: USERS_MESSAGES.CHANGE_PASSWORDS_SUCCESS
    }
  }
}

const usersService = new UsersService()
export default usersService
