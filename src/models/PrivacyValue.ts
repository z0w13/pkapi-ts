import { Schema } from 'effect'

const PrivacyValue = Schema.NullOr(Schema.Literal('private', 'public'))
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type PrivacyValue = Schema.Schema.Type<typeof PrivacyValue>

export default PrivacyValue
