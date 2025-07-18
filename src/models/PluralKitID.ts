import { Schema } from 'effect'

const PluralKitID = Schema.NonEmptyString.pipe(
  Schema.pattern(/^[a-z]{5,6}$/),
  Schema.brand('PluralKitID')
)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type PluralKitID = Schema.Schema.Type<typeof PluralKitID>
export default PluralKitID

const PluralKitIDFromString = Schema.compose(
  Schema.NonEmptyString.pipe(
    Schema.pattern(/^([a-zA-Z]{3}-[a-zA-Z]{3}|[a-zA-Z]{5,6})$/),
    Schema.brand('PluralKitID')
  ),
  Schema.transform(Schema.NonEmptyString, PluralKitID, {
    strict: true,
    decode: (input) => PluralKitID.make(input.toLowerCase().replaceAll('-', '')),
    encode: (input) => input
  })
)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type PluralKitIDFromString = Schema.Schema.Type<typeof PluralKitIDFromString>
export { PluralKitIDFromString }
