import z from 'zod'

import {
  GuildSnowflake,
  ChannelSnowflake,
  UserSnowflake,
  MessageSnowflake
} from './DiscordSnowflake.ts'
import Member from './Member.ts'
import System from './System.ts'

const Message = z.object({
  timestamp: z.date(),
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

export const MessageFromApi = Message.extend({
  timestamp: z.iso.datetime().transform((v) => new Date(v))
})
