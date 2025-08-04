import z from 'zod/v4'

import Color from './Color.js'
import { GroupIDFromString, GroupUUID } from './GroupID.js'
import { SystemIDFromString } from './SystemID.js'
import GroupPrivacy from './GroupPrivacy.js'
import { MemberUUID } from './MemberID.js'

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

const GroupWithMembers = Group.extend({
  members: z.array(MemberUUID),
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type GroupWithMembers = z.infer<typeof GroupWithMembers>
export { GroupWithMembers }

const SimpleGroup = Group.extend({
  id: z.string(),
  uuid: z.uuid(),
  system: z.optional(z.string())
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SimpleGroup = z.infer<typeof SimpleGroup>
export { SimpleGroup }
