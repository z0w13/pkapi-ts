import z from 'zod/v4'

const PluralKitID = z.codec(
  z.string().regex(/^([a-zA-Z]{3}-[a-zA-Z]{3}|[a-zA-Z]{5,6})$/),
  z
    .string()
    .regex(/^[a-z]{5,6}$/)
    .brand<'PluralKitID'>(),
  {
    encode: (value) => value,
    decode: (value) => value.toLowerCase().replaceAll('-', '')
  }
)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type PluralKitID = z.infer<typeof PluralKitID>
export default PluralKitID
