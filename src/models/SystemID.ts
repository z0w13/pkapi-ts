import z from 'zod'
import PluralKitID, { PluralKitIDFromString } from './PluralKitID.ts'

const SystemID = PluralKitID.brand<'SystemID'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SystemID = z.infer<typeof SystemID>
export default SystemID

const SystemIDFromString = PluralKitIDFromString.brand<'SystemID'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SystemIDFromString = z.infer<typeof SystemID>
export { SystemIDFromString }

const SystemUUID = z.uuidv4().brand<'SystemUUID'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SystemUUID = z.infer<typeof SystemUUID>
export { SystemUUID }

const SystemRef = z.union([SystemID, SystemUUID])
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SystemRef = z.infer<typeof SystemRef>
export { SystemRef }
