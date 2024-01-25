import { ParamsDictionary } from 'express-serve-static-core'

export interface GetConversationParam extends ParamsDictionary {
  receiver_id: string
}
