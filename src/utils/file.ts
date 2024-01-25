import fs from 'fs'
import { Request } from 'express'
import formidable, { File } from 'formidable'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import path from 'path'
export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true //Create nested folder
      })
    }
  })
}
export const handleUploadImage = async (req: Request) => {
  // Cách sử dụng ESmodules trong project dùng CommonJS
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR, //Thư mục lưu ảnh tạm khi client upload
    maxFiles: 4, //Số file được gửi lên
    keepExtensions: true, //Giữ lại đuôi mở rộng của file,
    maxFileSize: 300 * 1024, //300KB,
    maxTotalFileSize: 300 * 1024 * 4,

    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }
      resolve(files.image as File[])
    })
  })
}

//Cách xử lý khi upload video và encode
//CÓ 2 giai đoạn:
//Upload Video: Upload video thành công thì resolve về cho người dùng
//Encode video: Khai báo thêm 1 url endpoint để check xem cái video đó đã encode xong chưa

export const handleUploadVideo = async (req: Request) => {
  // Cách sử dụng ESmodules trong project dùng CommonJS
  const formidable = (await import('formidable')).default
  const nanoid = (await import('nanoid')).nanoid
  const idName = nanoid()
  const folderPath = path.resolve(UPLOAD_VIDEO_DIR, idName)
  fs.mkdirSync(folderPath)
  const form = formidable({
    uploadDir: folderPath, //Thư mục lưu ảnh tạm khi client upload
    maxFiles: 1, //Số file được gửi lên
    maxFileSize: 50 * 1024 * 1024, //50MB,

    filter: function ({ name, originalFilename, mimetype }) {
      console.log(mimetype)
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    },
    filename: function () {
      return idName
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('File is empty'))
      }
      const videos = files.video
      videos?.forEach((video) => {
        const extension = getExtension(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + extension)
        video.newFilename = video.newFilename + '.' + extension
        video.filepath = video.filepath + '.' + extension
      })
      resolve(files.video as File[])
    })
  })
}
export const getNameFromFilename = (fileName: string) => {
  const name = fileName.split('.')
  return name[0]
}
export const getExtension = (fileName: string) => {
  const name = fileName.split('.')
  return name[name.length - 1]
}
