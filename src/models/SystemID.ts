import { Schema } from 'effect'
import PluralKitID, { PluralKitIDFromString } from './PluralKitID.ts'

const SystemID = PluralKitID.pipe(Schema.brand('SystemID'))
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SystemID = Schema.Schema.Type<typeof SystemID>
export default SystemID

const SystemIDFromString = Schema.compose(PluralKitIDFromString, SystemID)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SystemIDFromString = Schema.Schema.Type<typeof SystemID>
export { SystemIDFromString }

const SystemUUID = Schema.UUID.pipe(Schema.brand('SystemUUID'))
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SystemUUID = Schema.Schema.Type<typeof SystemUUID>
export { SystemUUID }
