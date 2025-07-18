import { Schema } from 'effect'
import DiscordSnowflake from './DiscordSnowflake.ts'
import { MemberIDFromString } from './MemberID.ts'

const AutoproxyMode = Schema.Literal('off', 'front', 'latch', 'member')
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type AutoproxyMode = Schema.Schema.Type<typeof AutoproxyMode>
export { AutoproxyMode }

const AutoproxySettings = Schema.Struct({
  guildId: Schema.propertySignature(Schema.UndefinedOr(DiscordSnowflake)).pipe(
    Schema.fromKey('guild_id')
  ),
  channelId: Schema.propertySignature(Schema.UndefinedOr(DiscordSnowflake)).pipe(
    Schema.fromKey('channel_id')
  ),
  autoproxyMode: Schema.propertySignature(AutoproxyMode).pipe(Schema.fromKey('autoproxy_mode')),
  autoproxyMember: Schema.propertySignature(Schema.NullOr(MemberIDFromString)).pipe(
    Schema.fromKey('autoproxy_member')
  ),
  lastLatchTimestamp: Schema.propertySignature(Schema.DateFromString).pipe(
    Schema.fromKey('last_latch_timestamp')
  )
}).pipe(
  Schema.filter((v) => {
    if (v.autoproxyMode === 'front' && v.autoproxyMember) {
      return 'autoproxyMember must be `null` if autoproxyMode is set to `front`'
    }

    return true
  })
)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type AutoproxySettings = Schema.Schema.Type<typeof AutoproxySettings>
export default AutoproxySettings
