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
  // TODO: Convert Date <-> string
  timestamp: z.iso.datetime(),
  id: MessageSnowflake,
  original: MessageSnowflake,
  sender: UserSnowflake,
  channel: ChannelSnowflake,
  guild: GuildSnowflake,
  system: z.optional(System),
  member: z.optional(Member)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Message = z.infer<typeof Message>
export default Message
