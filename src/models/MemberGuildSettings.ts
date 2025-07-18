import { Schema } from 'effect'

import DiscordSnowflake from './DiscordSnowflake.ts'
import URL from './URL.ts'

const MemberGuildSettings = Schema.Struct({
  guildId: Schema.propertySignature(DiscordSnowflake).pipe(Schema.fromKey('guild_id')),
  displayName: Schema.propertySignature(
    Schema.NullOr(Schema.String.pipe(Schema.maxLength(100)))
  ).pipe(Schema.fromKey('display_name')),
  avatarUrl: Schema.propertySignature(Schema.NullOr(URL.pipe(Schema.maxLength(256)))).pipe(
    Schema.fromKey('avatar_url')
  ),
  keepProxy: Schema.propertySignature(Schema.Boolean).pipe(Schema.fromKey('keep_proxy'))
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type MemberGuildSettings = Schema.Schema.Type<typeof MemberGuildSettings>
export default MemberGuildSettings
