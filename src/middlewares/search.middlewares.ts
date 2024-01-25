import { checkSchema } from 'express-validator'
import { MediaTypeQuery } from '~/constants/enums'
import { SEARCH_MESSAGES } from '~/constants/messages'
import { numberEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation'
const mediaType = Object.values(MediaTypeQuery)
console.log(mediaType)
export const searchValidator = validate(
  checkSchema(
    {
      content: {
        isString: {
          errorMessage: SEARCH_MESSAGES.CONTENT_MUST_BE_STRING
        }
      },
      media_type: {
        optional: true,
        isIn: {
          options: [mediaType],
          errorMessage: SEARCH_MESSAGES.MEDIA_TYPE_INVALID
        }
      },
      people_follow: {
        optional: true,
        isBoolean: {
          errorMessage: SEARCH_MESSAGES.PEOPLE_FOLLOW_INVALID
        }
      }
    },
    ['query']
  )
)
