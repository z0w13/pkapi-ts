import { Schema } from 'effect'

import DiscordSnowflake from './DiscordSnowflake.ts'
import Member from './Member.ts'
import System from './System.ts'

const Message = Schema.Struct({
  timestamp: Schema.DateFromString,
  id: DiscordSnowflake,
  original: DiscordSnowflake,
  sender: DiscordSnowflake,
  channel: DiscordSnowflake,
  guild: DiscordSnowflake,
  system: Schema.UndefinedOr(System),
  member: Schema.UndefinedOr(Member)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Message = Schema.Schema.Type<typeof Message>
export default Message
