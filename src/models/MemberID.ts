import { Schema } from 'effect'
import PluralKitID, { PluralKitIDFromString } from './PluralKitID.ts'

const MemberID = PluralKitID.pipe(Schema.brand('MemberID'))
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type MemberID = Schema.Schema.Type<typeof MemberID>
export default MemberID

const MemberIDFromString = Schema.compose(PluralKitIDFromString, MemberID)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type MemberIDFromString = Schema.Schema.Type<typeof MemberID>
export { MemberIDFromString }

const MemberUUID = Schema.UUID.pipe(Schema.brand('MemberUUID'))
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type MemberUUID = Schema.Schema.Type<typeof MemberUUID>
export { MemberUUID }

const MemberRef = Schema.Union(MemberID, MemberUUID)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type MemberRef = Schema.Schema.Type<typeof MemberRef>
export { MemberRef }
