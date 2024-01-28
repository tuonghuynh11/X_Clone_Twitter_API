import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { ParamsDictionary, Query } from 'express-serve-static-core'
import { Pagination } from './Tweet.requests'
/**
 * @swagger
 * components:
 *   schemas:
 *     LoginBody:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: abc@gmail.com
 *         password:
 *           type: string
 *           example: '123456'
 *     SuccessAuthentication:
 *       type: object
 *       properties:
 *         access_token:
 *           type: integer
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVhNjhiY2RjMzZkYWFmMTE0YzMwN2Q5IiwidG9rZW5fdHlwZSI6MCwidmVyaWZ5IjoxLCJpYXQiOjE3MDYwMjAyMTgsImV4cCI6MTcwNjAyMTExOH0.MD0VbO0_btDTMiNXu2AeGD904J11wLcmuzQdxquNyjI
 *         refresh_token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVhNjhiY2RjMzZkYWFmMTE0YzMwN2Q5IiwidG9rZW5fdHlwZSI6MSwidmVyaWZ5IjoxLCJpYXQiOjE3MDYwMjAyMTgsImV4cCI6MTcxNDY2MDIxOH0.z4T-D_ZMrGASUfiN_UZANfQ2UWmGHrwnNxZrTcu9fM0
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: MongoId
 *           example: '65a68bcdc36daaf114c307d9'
 *         name:
 *           type: string
 *           example: 'HMT'
 *         email:
 *           type: string
 *           format: email
 *           example: 'hmt1@gmail.com'
 *         date_of_birth:
 *           type: string
 *           format: ISO86011
 *           example: '1970-01-01T00:00:00.000Z'
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: '2024-01-16T13:59:41.515Z'
 *         updated_at:
 *           type: string
 *           format: ISO86011
 *           example: '2024-01-16T13:59:41.515Z'
 *         verify:
 *           $ref: '#/components/schemas/UserVerifyStatus'
 *         bio:
 *           type: string
 *           example: 'This is my bio'
 *         location:
 *           type: string
 *           example: 'HCM, VN'
 *         website:
 *           type: string
 *           example: 'https://www.google.com'
 *         username:
 *           type: string
 *           example: 'user65a68bcdc36daaf114c307d9'
 *         avatar:
 *           type: string
 *           example: 'http://localhost:4000/images/avatars/65a68bcdc36daaf114c307d9/avatar.png'
 *         cover_photo:
 *           type: string
 *           example: 'http://localhost:4000/images/avatars/65a68bcdc36daaf114c307d9/cover_photo.png'
 *         twitter_circle:
 *           type: array
 *           format: MongoId
 *           items:
 *             type: string
 *           example: ['65a68bcdc36daaf114c307d9']
 *     UserVerifyStatus:
 *       type: number
 *       enum: [Unverified, Verified, Banned]
 *       example: 0
 */

export interface LoginReqBody {
  email: string
  password: string
}
export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}
export interface VerifyReqReqBody {
  email_verify_token: string
}
export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  day_of_birth: string
}
export interface LogoutReqBody {
  refresh_token: string
}
export interface RefreshTokenReqBody {
  refresh_token: string
}
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}
export interface ForgotPasswordReqBody {
  email: string
}
export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}
export interface ResetPasswordReqBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}

export interface GetProfileReqParams extends ParamsDictionary {
  username: string
}

export interface FollowReqBody {
  followed_user_id: string
}
export interface UnFollowReqParams extends ParamsDictionary {
  user_id: string
}

export interface ChangePasswordReqBody {
  old_password: string
  new_password: string
  confirm_password: string
}

export interface FollowerQuery extends Pagination, Query {}
