import z from 'zod'

const PluralKitID = z
  .string()
  .regex(/^[a-z]{5,6}$/)
  .brand<'PluralKitID'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type PluralKitID = z.infer<typeof PluralKitID>
export default PluralKitID

const PluralKitIDFromString = z
  .string()
  .regex(/^([a-zA-Z]{3}-[a-zA-Z]{3}|[a-zA-Z]{5,6})$/)
  .transform((v) => v.toLowerCase().replaceAll('-', ''))
  .pipe(PluralKitID)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type PluralKitIDFromString = z.infer<typeof PluralKitIDFromString>
export { PluralKitIDFromString }
