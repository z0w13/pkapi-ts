import { Schema } from 'effect'
import DiscordSnowflake from './DiscordSnowflake.ts'

const SystemGuildSettings = Schema.Struct({
  guildId: Schema.propertySignature(DiscordSnowflake).pipe(Schema.fromKey('guild_id')),
  proxyingEnabled: Schema.propertySignature(Schema.Boolean).pipe(
    Schema.fromKey('proxying_enabled')
  ),
  tag: Schema.NullOr(Schema.String.pipe(Schema.maxLength(79))),
  tagEnabled: Schema.propertySignature(Schema.Boolean).pipe(Schema.fromKey('tag_enabled'))
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SystemGuildSettings = Schema.Schema.Type<typeof SystemGuildSettings>
export default SystemGuildSettings
