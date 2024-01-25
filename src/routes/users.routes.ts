import { Router } from 'express'
import {
  changePasswordController,
  followController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  oauthController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  resetPasswordTokenController,
  unFollowController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordTokenValidator,
  unFollowValidator,
  updateMeValidator,
  verifiedUSerValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
import { wrapRequestHandler } from '~/utils/handles'
const usersRouter = Router()

/**
 * Description: Login a user
 * Path: /login
 * Method: POST
 * Body: { email:string, password:string}
 * **/

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - users
 *     summary: Login
 *     description: Login with email and password
 *     operationId: login
 *     requestBody:
 *       description: Login Information
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginBody"
 *       required: true
 *     responses:
 *       "200":
 *         description: Login Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 result:
 *                   $ref: "#/components/schemas/SuccessAuthentication"
 *       "400":
 *         description: Invalid ID supplied
 *       "404":
 *         description: Pet not found
 *       "422":
 *         description: Validation exception
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
/**
 * Description: OAuth with Google
 * Path: /oauth/google
 * Method: GET
 * **/
usersRouter.get('/oauth/google', wrapRequestHandler(oauthController))

/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: {name:string, email:string, password:string, confirm_password:string ,date_of_birth:ISO8601}
 * **/

usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Logout a user
 * Path: /logout
 * Method: POST
 * Header:{Authorization:Bearer <access_token>}
 * Body: { refresh_token:string}
 * **/
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Refresh Token
 * Path: /refresh-token
 * Method: POST
 * Body: { refresh_token:string}
 * **/
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * Description: Verify Email
 * Path: /verify-email
 * Method: POST
 * Body: {  email_verify_token:string}
 * **/
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description: Resend Verify Email
 * Path: /resend-verify-email
 * Method: POST
 * Header:{Authorization:Bearer <access_token>}
 * Body: {}
 * **/
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * Description: Submit email to reset password, send email to user
 * Path: /forgot-password
 * Method: POST
 * Body: {email:string}
 * **/
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: Verify link in email to reset password
 * Path: /verify-forgot-password-token
 * Method: POST
 * Body: {forgot-password-token:string}
 * **/
usersRouter.post(
  '/verify-forgot-password-token',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordTokenController)
)
/**
 * Description: Reset password
 * Path: /reset-password
 * Method: POST
 * Body: {forgot-password-token:string, password:string,confirm-password:string}
 * **/
usersRouter.post('/reset-password', resetPasswordTokenValidator, wrapRequestHandler(resetPasswordTokenController))

/**
 * Description: Get My Profile
 * Path: /me
 * Method: GET
 * Header:{Authorization:Bearer <access_token>}
 * **/
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: Update My Profile
 * Path: /me
 * Method: PATCH
 * Header:{Authorization:Bearer <access_token>}
 * Body:UserSchema
 * **/
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUSerValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

/**
 * Description: Get User Profile
 * Path: /:username
 * Method: GET
 * **/
usersRouter.get('/:username', wrapRequestHandler(getProfileController))

/**
 * Description: Follow Someone
 * Path: /follow
 * Method: POST
 * Header:{Authorization:Bearer <access_token>}
 * Body:{follower_user_id:string}
 * **/
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUSerValidator,
  followValidator,
  wrapRequestHandler(followController)
)

/**
 * Description: UnFollow Someone
 * Path: //follow/:user_id
 * Method: DELETE
 * Header:{Authorization:Bearer <access_token>}
 * Body:{followed_user_id:string}
 * **/
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUSerValidator,
  unFollowValidator,
  wrapRequestHandler(unFollowController)
)

/**
 * Description: Change Password
 * Path: /change-password
 * Method: PUT
 * Header:{Authorization:Bearer <access_token>}
 * Body:{old_password:string,new_password:string, confirm_password:string}
 * **/
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUSerValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)
export default usersRouter
