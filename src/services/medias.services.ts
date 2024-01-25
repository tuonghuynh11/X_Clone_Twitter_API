import { Request } from 'express'
import { getNameFromFilename, handleUploadImage, handleUploadVideo } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR } from '~/constants/dir'
import path from 'path'
import { uploadImage } from '~/utils/cloudinary'
import fs from 'fs'
import fsPromises from 'fs/promises'
import { envConfig, isProduction } from '~/constants/config'
import { File } from 'formidable'
import { EncodingStatus, MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import { assignWith } from 'lodash'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.schema'

class Queue {
  items: string[]
  encoding: boolean
  constructor() {
    this.items = []
    this.encoding = false
  }
  async enqueue(item: string) {
    this.items.push(item)
    const idName = getNameFromFilename(item.split('\\').pop() as string)
    await databaseService.videoStatus.insertOne(
      new VideoStatus({
        name: idName,
        status: EncodingStatus.Pending
      })
    )
    this.processEncode()
  }
  async processEncode() {
    if (this.encoding) return
    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]

      const idName = getNameFromFilename(videoPath.split('\\').pop() as string)
      await databaseService.videoStatus.updateOne(
        { name: idName },
        {
          $set: {
            status: EncodingStatus.Processing
          },
          $currentDate: {
            update_at: true
          }
        }
      )
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        await fsPromises.unlink(videoPath)

        await databaseService.videoStatus.updateOne(
          { name: idName },
          {
            $set: {
              status: EncodingStatus.Success
            },
            $currentDate: {
              update_at: true
            }
          }
        )
        console.log(`Encode Video ${videoPath} successfully`)
      } catch (error) {
        await databaseService.videoStatus
          .updateOne(
            { name: idName },
            {
              $set: {
                status: EncodingStatus.Failed
              },
              $currentDate: {
                update_at: true
              }
            }
          )
          .catch((err) => {
            console.error('Update VideoStatus Error: ', err)
          })
        console.error(`Failed to encode video ${videoPath}`)
        console.error(error)
      }
      this.encoding = false

      this.processEncode()
    } else {
      console.log('Encode video queue is empty')
    }
  }
}
const queue = new Queue()
class MediaService {
  async uploadImage(req: Request) {
    const files: any = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file: File) => {
        const newName = getNameFromFilename(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)

        // const image_url = await uploadImage(newPath)
        // return image_url;
        fs.unlinkSync(file.filepath)
        return {
          url: isProduction
            ? `${envConfig.host}/static/image/${newName}.jpg`
            : `http://localhost:${envConfig.port}/static/image/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )
    return result
  }
  async uploadVideo(req: Request) {
    const files: any = await handleUploadVideo(req)
    const { newFilename } = files[0]

    const result = files.map((file: File) => {
      return {
        url: isProduction
          ? `${envConfig.host}/static/video/${file.newFilename}`
          : `http://localhost:${envConfig.port}/static/video/${file.newFilename}`,
        type: MediaType.Video
      }
    })
    return result
  }
  async uploadVideoHLS(req: Request) {
    const files: any = await handleUploadVideo(req)

    const result: Media[] = await Promise.all(
      files.map(async (file: File) => {
        const newName = getNameFromFilename(file.newFilename)
        queue.enqueue(file.filepath)
        return {
          url: isProduction
            ? `${envConfig.host}/static/video-hls/${newName}/master.m3u8`
            : `http://localhost:${envConfig.port}/static/video-hls/${newName}/master.m3u8`,
          type: MediaType.HLS
        }
      })
    )
    return result
  }
  async getVideoStatus(idVideo: string) {
    const data = await databaseService.videoStatus.findOne({ name: idVideo })
    return data
  }
}
const mediaService = new MediaService()
export default mediaService
