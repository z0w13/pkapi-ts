import z from 'zod'

import PluralKitID, { PluralKitIDFromString } from './PluralKitID.ts'

const MemberID = PluralKitID.brand<'MemberID'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type MemberID = z.infer<typeof MemberID>
export default MemberID

const MemberIDFromString = PluralKitIDFromString.brand<'MemberID'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type MemberIDFromString = z.infer<typeof MemberID>
export { MemberIDFromString }

const MemberUUID = z.uuidv4().brand<'MemberUUID'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type MemberUUID = z.infer<typeof MemberUUID>
export { MemberUUID }

const MemberRef = z.union([MemberID, MemberUUID])
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type MemberRef = z.infer<typeof MemberRef>
export { MemberRef }
