import { v2 as cloudinary } from 'cloudinary'
import { config } from 'dotenv'
config()
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})
export const uploadImage = async (image_url: string) => {
  const url = await cloudinary.uploader.upload(image_url, { public_id: 'olympic_flag' }, function (error, result) {
    console.log('url', result)
  })
  return url.url
}
