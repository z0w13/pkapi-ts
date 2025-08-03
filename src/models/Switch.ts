import z from 'zod/v4'

import Member, { MemberFromApi } from './Member.ts'
import MemberID from './MemberID.ts'
import { SwitchID } from './SwitchID.ts'

const Switch = z.object({
  id: SwitchID,
  timestamp: z.date(),
  members: z.union([z.array(Member), z.array(MemberID)])
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Switch = z.infer<typeof Switch>
export default Switch

export const SwitchFromApi = Switch.extend({
  timestamp: z.iso.datetime().transform((v) => new Date(v)),
  members: z.union([z.array(MemberFromApi), z.array(MemberID)])
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
export type SwitchFromApi = z.infer<typeof SwitchFromApi>

export const SwitchWithMembers = Switch.extend({
  members: z.array(Member)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
export type SwitchWithMembers = z.infer<typeof SwitchWithMembers>

export const SwitchWithMembersFromApi = SwitchWithMembers.extend({
  timestamp: z.iso.datetime().transform((v) => new Date(v)),
  members: z.array(MemberFromApi)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
export type SwitchWithMembersFromApi = z.infer<typeof SwitchWithMembersFromApi>

export const SwitchWithMemberIDs = Switch.extend({
  members: z.array(MemberID)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
export type SwitchWithMemberIDs = z.infer<typeof SwitchWithMemberIDs>

export const SwitchWithMemberIDsFromApi = SwitchWithMemberIDs.extend({
  timestamp: z.iso.datetime().transform((v) => new Date(v))
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
export type SwitchWithMemberIDsFromApi = z.infer<typeof SwitchWithMemberIDsFromApi>
