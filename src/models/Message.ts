import z from 'zod/v4'

import {
  GuildSnowflake,
  ChannelSnowflake,
  UserSnowflake,
  MessageSnowflake
} from './DiscordSnowflake.js'
import Member from './Member.js'
import System from './System.js'
import { IsoDateTimeToDateCodec } from './ZodCodecs.js'

const Message = z.object({
  timestamp: IsoDateTimeToDateCodec,
  id: MessageSnowflake,
  original: MessageSnowflake,
  sender: UserSnowflake,
  channel: ChannelSnowflake,
  guild: z.nullable(GuildSnowflake),
  system: z.optional(System),
  member: z.optional(Member)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Message = z.infer<typeof Message>
export default Message
