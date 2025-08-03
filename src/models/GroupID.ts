import z from 'zod/v4'

import PluralKitID, { PluralKitIDFromString } from './PluralKitID.ts'

const GroupID = PluralKitID.brand<'GroupID'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type GroupID = z.infer<typeof GroupID>
export default GroupID

const GroupIDFromString = PluralKitIDFromString.brand<'GroupID'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type GroupIDFromString = z.infer<typeof GroupID>
export { GroupIDFromString }

const GroupUUID = z.uuidv4().brand<'GroupUUID'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type GroupUUID = z.infer<typeof GroupUUID>
export { GroupUUID }

const GroupRef = z.union([GroupID, GroupUUID])
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type GroupRef = z.infer<typeof GroupRef>
export { GroupRef }
