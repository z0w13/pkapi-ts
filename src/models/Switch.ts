import z from 'zod/v4'

import Member from './Member.js'
import MemberID from './MemberID.js'
import { SwitchID } from './SwitchID.js'
import { IsoDateTimeToDateCodec } from './ZodCodecs.js'

const Switch = z.object({
  id: SwitchID,
  timestamp: IsoDateTimeToDateCodec,
  members: z.union([z.array(Member), z.array(MemberID)])
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Switch = z.infer<typeof Switch>
export default Switch

export const SwitchWithMembers = Switch.extend({
  members: z.array(Member)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
export type SwitchWithMembers = z.infer<typeof SwitchWithMembers>

export const SwitchWithMemberIDs = Switch.extend({
  members: z.array(MemberID)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
export type SwitchWithMemberIDs = z.infer<typeof SwitchWithMemberIDs>
