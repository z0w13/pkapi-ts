import { Schema } from 'effect'

import Member from './Member.ts'
import { MemberIDFromString } from './MemberID.ts'
import { SwitchID } from './SwitchID.ts'

const Switch = Schema.Struct({
  id: SwitchID,
  timestamp: Schema.DateFromString,
  members: Schema.Union(Schema.Array(Member), Schema.Array(MemberIDFromString))
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Switch = Schema.Schema.Type<typeof Switch>
export default Switch
