import { Router } from 'express'
import {
  uploadImageController,
  uploadVideoController,
  uploadVideoHLSController,
  videoStatusController
} from '~/controllers/medias.controllers'
import { accessTokenValidator, verifiedUSerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handles'
const mediaRouter = Router()

mediaRouter.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUSerValidator,
  wrapRequestHandler(uploadImageController)
)
mediaRouter.post(
  '/upload-video',
  accessTokenValidator,
  verifiedUSerValidator,
  wrapRequestHandler(uploadVideoController)
)

mediaRouter.post(
  '/upload-video-hls',
  accessTokenValidator,
  verifiedUSerValidator,
  wrapRequestHandler(uploadVideoHLSController)
)

mediaRouter.get(
  '/video-status/:id',
  accessTokenValidator,
  verifiedUSerValidator,
  wrapRequestHandler(videoStatusController)
)
export default mediaRouter
