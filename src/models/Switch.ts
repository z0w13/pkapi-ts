import z from 'zod'

import Member from './Member.ts'
import { MemberIDFromString } from './MemberID.ts'
import { SwitchID } from './SwitchID.ts'

const Switch = z.object({
  id: SwitchID,
  timestamp: z.iso.datetime(),
  members: z.union([z.array(Member), z.array(MemberIDFromString)])
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Switch = z.infer<typeof Switch>
export default Switch
