import z from 'zod/v4'

import Color from './Color.js'
import Birthday from './Birthday.js'
import ProxyTag from './ProxyTag.js'
import SystemID from './SystemID.js'
import MemberID, { MemberUUID } from './MemberID.js'
import MemberPrivacy from './MemberPrivacy.js'
import { IsoDateTimeToDateCodec } from './ZodCodecs.js'

const Member = z.object({
  id: MemberID,
  uuid: MemberUUID,
  system: z.optional(SystemID),

  name: z.nullable(z.string().max(100)),
  displayName: z.nullable(z.string().max(100)),
  color: z.nullable(Color),
  birthday: z.nullable(Birthday),
  pronouns: z.nullable(z.string().max(100)),
  avatarUrl: z.nullable(z.url().max(256)),
  webhookAvatarUrl: z.nullable(z.url().max(256)),
  banner: z.nullable(z.url().max(256)),
  description: z.nullable(z.string().max(1000)),
  created: z.nullable(IsoDateTimeToDateCodec),
  proxyTags: z.array(ProxyTag),
  keepProxy: z.boolean(),
  tts: z.boolean(),
  autoproxyEnabled: z.nullable(z.boolean()),
  messageCount: z.nullable(z.int().min(0)),
  lastMessageTimestamp: z.nullable(IsoDateTimeToDateCodec),
  privacy: z.nullable(MemberPrivacy)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Member = z.infer<typeof Member>
export default Member

const SimpleMember = Member.extend({
  id: z.string(),
  uuid: z.uuid(),
  system: z.optional(z.string())
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SimpleMember = z.infer<typeof SimpleMember>
export { SimpleMember }
