import z from 'zod/v4'

const PrivacyValue = z.nullable(z.literal(['private', 'public']))
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type PrivacyValue = z.infer<typeof PrivacyValue>

export default PrivacyValue
