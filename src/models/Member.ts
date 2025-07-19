import z from 'zod'

import Color from './Color.ts'
import { BirthdayFromString } from './Birthday.ts'
import ProxyTag from './ProxyTag.ts'
import SystemID from './SystemID.ts'
import { MemberIDFromString, MemberUUID } from './MemberID.ts'
import MemberPrivacy from './MemberPrivacy.ts'

const Member = z.object({
  id: MemberIDFromString,
  uuid: MemberUUID,
  system: z.optional(SystemID),

  name: z.nullable(z.string().max(100)),
  displayName: z.nullable(z.string().max(100)),
  color: z.nullable(Color),
  birthday: z.nullable(BirthdayFromString),
  pronouns: z.nullable(z.string().max(100)),
  avatarUrl: z.nullable(z.url().max(256)),
  webhookAvatarUrl: z.nullable(z.url().max(256)),
  banner: z.nullable(z.url().max(256)),
  description: z.nullable(z.string().max(1000)),
  created: z.nullable(z.iso.datetime()),
  proxyTags: z.array(ProxyTag),
  keepProxy: z.boolean(),
  tts: z.boolean(),
  autoproxyEnabled: z.nullable(z.boolean()),
  messageCount: z.nullable(z.int().min(0)),
  lastMessageTimestamp: z.nullable(z.iso.datetime()),
  privacy: z.nullable(MemberPrivacy)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Member = z.infer<typeof Member>

export default Member
