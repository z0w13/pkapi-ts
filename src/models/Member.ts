import { Schema } from 'effect'

import Color from './Color.ts'
import { BirthdayFromString } from './Birthday.ts'
import ProxyTag from './ProxyTag.ts'
import URL from './URL.ts'
import SystemID from './SystemID.ts'
import { MemberIDFromString } from './MemberID.ts'
import MemberPrivacy from './MemberPrivacy.ts'

const Member = Schema.Struct({
  id: MemberIDFromString,
  uuid: Schema.UUID,
  system: Schema.UndefinedOr(SystemID),

  name: Schema.NullOr(Schema.String.pipe(Schema.maxLength(100))),
  displayName: Schema.propertySignature(
    Schema.NullOr(Schema.String.pipe(Schema.maxLength(100)))
  ).pipe(Schema.fromKey('display_name')),
  color: Schema.NullOr(Color),
  birthday: Schema.NullOr(BirthdayFromString),
  pronouns: Schema.NullOr(Schema.String.pipe(Schema.maxLength(100))),
  avatarUrl: Schema.propertySignature(Schema.NullOr(URL.pipe(Schema.maxLength(256)))).pipe(
    Schema.fromKey('avatar_url')
  ),
  webhookAvatarUrl: Schema.propertySignature(Schema.NullOr(URL.pipe(Schema.maxLength(256)))).pipe(
    Schema.fromKey('webhook_avatar_url')
  ),
  banner: Schema.NullOr(URL.pipe(Schema.maxLength(256))),
  description: Schema.NullOr(Schema.String.pipe(Schema.maxLength(1000))),
  created: Schema.NullOr(Schema.DateFromString),
  proxyTags: Schema.propertySignature(Schema.Array(ProxyTag)).pipe(Schema.fromKey('proxy_tags')),
  keepProxy: Schema.propertySignature(Schema.Boolean).pipe(Schema.fromKey('keep_proxy')),
  tts: Schema.Boolean,
  autoproxyEnabled: Schema.propertySignature(Schema.NullOr(Schema.Boolean)).pipe(
    Schema.fromKey('autoproxy_enabled')
  ),
  messageCount: Schema.propertySignature(Schema.NullOr(Schema.Number)).pipe(
    Schema.fromKey('message_count')
  ),
  lastMessageTimestamp: Schema.propertySignature(Schema.NullOr(Schema.DateFromString)).pipe(
    Schema.fromKey('last_message_timestamp')
  ),
  privacy: Schema.NullOr(MemberPrivacy)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Member = Schema.Schema.Type<typeof Member>

export default Member
