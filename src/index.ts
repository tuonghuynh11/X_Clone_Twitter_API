import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import cors, { CorsOptions } from 'cors'
import mediaRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
import tweetsRouter from './routes/tweets.routes'
import bookmarksRouter from './routes/bookmarks.routes'
import likesRouter from './routes/likes.routes'
import searchRouter from './routes/search.routes'
// import '~/utils/fakes'

import { createServer } from 'http'

import conversationsRouter from './routes/conversations.routes'
import initSocket from './utils/socket'

import YAML from 'yaml'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import swaggerJSDoc from 'swagger-jsdoc'
import { envConfig, isProduction } from '~/constants/config'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'

databaseService.connect().then(() => {
  databaseService.createIndexes()
})
const app = express()
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
})
const httpServer = createServer(app)
const PORT = envConfig.port || 3000

//Swagger Document
// const file = fs.readFileSync(path.resolve('twitter-swagger.yaml'), 'utf8')
// const swaggerDocument = YAML.parse(file)

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'X clone (Twitter API)',
      version: '1.0.0'
    }
  },

  apis: ['./openapi/*.yaml'] // files containing annotations as above
}
const openapiSpecification = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

//Create uploads folder If project not contain it
initFolder()
//User express rate limit
app.use(limiter)
//Use Helmet
app.use(helmet())

const corsOptions: CorsOptions = {
  origin: isProduction ? envConfig.clientUrl : '*'
}
app.use(cors(corsOptions))
app.use(express.json())

app.use('/users', usersRouter)
app.use('/medias', mediaRouter)
app.use('/static', staticRouter)
app.use('/tweets', tweetsRouter)
app.use('/search', searchRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likesRouter)
app.use('/conversations', conversationsRouter)
// app.use('/static', express.static(UPLOAD_IMAGE_DIR))
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))
app.use(defaultErrorHandler)

initSocket(httpServer)
httpServer.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
