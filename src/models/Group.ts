import z from 'zod/v4'

import Color from './Color.js'
import GroupID, { GroupUUID } from './GroupID.js'
import SystemID from './SystemID.js'
import GroupPrivacy from './GroupPrivacy.js'
import { MemberUUID } from './MemberID.js'
import { IsoDateTimeToDateCodec } from './ZodCodecs.js'

const Group = z.object({
  id: GroupID,
  uuid: GroupUUID,
  system: z.optional(SystemID),

  name: z.string().max(100),
  displayName: z.nullable(z.string().max(100)),
  description: z.nullable(z.string().max(1000)),
  icon: z.nullable(z.url().max(256)),
  banner: z.nullable(z.url().max(256)),
  color: z.nullable(Color),
  created: z.nullable(IsoDateTimeToDateCodec),
  privacy: z.nullable(GroupPrivacy)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Group = z.infer<typeof Group>
export default Group

const GroupWithMembers = Group.extend({
  members: z.array(MemberUUID)
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
