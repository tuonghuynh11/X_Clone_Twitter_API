import { Request, Response, NextFunction } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import mediaService from '~/services/medias.services'
import fs from 'fs'
import mine from 'mime'
import { getNameFromFilename } from '~/utils/file'
import databaseService from '~/services/database.services'
export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediaService.uploadImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}
export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediaService.uploadVideo(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}
export const uploadVideoHLSController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediaService.uploadVideoHLS(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}
export const videoStatusController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await mediaService.getVideoStatus(id as string)
  return res.json({
    message: USERS_MESSAGES.GET_VIDEO_STATUS_SUCCESS,
    result: result
  })
}
export const serveImageController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params

  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      const err_status = (err as Error as any).status

      return res.status(err_status).send('Not found')
    }
  })
}
export const serveM3u8Controller = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const realId = getNameFromFilename(id)
  console.log(id)
  return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, realId, 'master.m3u8'), (err) => {
    if (err) {
      const err_status = (err as Error as any).status

      return res.status(err_status).send('Not found')
    }
  })
}
export const serveSegmentController = async (req: Request, res: Response, next: NextFunction) => {
  const { id, v, segment } = req.params

  return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, id, v, segment), (err) => {
    if (err) {
      const err_status = (err as Error as any).status

      return res.status(err_status).send('Not found')
    }
  })
}
export const serveVideoStreamController = async (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Requires Range header')
  }
  const { name } = req.params
  const fullName = getNameFromFilename(name)
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, fullName, name)
  //1MB= 10^6 bytes (Tính theo hệ 10, đây là thứ mà chúng ta hay thấy trên UI)
  //Còn hệ nhị phân: 1MB= 2^20 bytes (1024*1024)

  //Tính toán Dung lượng video (bytes)
  const videoSize = fs.statSync(videoPath).size
  //Dung lượng video cho mỗi phân đoạn stream
  const chunkSize = 10 ** 6 //1MB

  //Lấy giá trị byte bắt đầu từ header Range (vd: bytes=10034314-)
  const start = Number(range.replace(/\D/g, ''))
  //Lấy giá trị byte kết thúc, vượt quá dung lượng video thì lấy giá trị videoSize
  //end phải luôn luôn nhỏ hơn videoSize
  const end = Math.min(start + chunkSize, videoSize - 1)

  //Dung lượng thực tế cho mỗi đoạn video stream
  //Thường đây sẽ là chunkSize, ngoại trừ đoạn cuối
  const contentLength = end - start + 1
  const contentType = mine.getType(videoPath) || 'video/*'

  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoStream = fs.createReadStream(videoPath, { start, end })
  videoStream.pipe(res)
}
