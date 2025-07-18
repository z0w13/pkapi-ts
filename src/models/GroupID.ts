import { Schema } from 'effect'
import PluralKitID, { PluralKitIDFromString } from './PluralKitID.ts'

const GroupID = PluralKitID.pipe(Schema.brand('GroupID'))
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type GroupID = Schema.Schema.Type<typeof GroupID>
export default GroupID

const GroupIDFromString = Schema.compose(PluralKitIDFromString, GroupID)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type GroupIDFromString = Schema.Schema.Type<typeof GroupID>
export { GroupIDFromString }
