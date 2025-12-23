import z from 'zod/v4'

import PluralKitID from './PluralKitID.js'

const GroupID = PluralKitID.brand<'GroupID'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type GroupID = z.infer<typeof GroupID>
export default GroupID

const GroupUUID = z.uuidv4().brand<'GroupUUID'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type GroupUUID = z.infer<typeof GroupUUID>
export { GroupUUID }

const GroupRef = z.union([GroupID, GroupUUID])
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type GroupRef = z.infer<typeof GroupRef>
export { GroupRef }
