import z from 'zod'

import Color from './Color.ts'
import { GroupIDFromString, GroupUUID } from './GroupID.ts'
import { SystemIDFromString } from './SystemID.ts'
import GroupPrivacy from './GroupPrivacy.ts'

const Group = z.object({
  id: GroupIDFromString,
  uuid: GroupUUID,
  system: z.optional(SystemIDFromString),

  name: z.string().max(100),
  displayName: z.nullable(z.string().max(100)),
  description: z.nullable(z.string().max(100)),
  icon: z.nullable(z.url().max(256)),
  banner: z.nullable(z.url().max(256)),
  color: z.nullable(Color),
  privacy: z.nullable(GroupPrivacy)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Group = z.infer<typeof Group>

export default Group
