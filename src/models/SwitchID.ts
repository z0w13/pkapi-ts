import z from 'zod/v4'

const SwitchID = z.uuidv4().brand<'SwitchID'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SwitchID = z.infer<typeof SwitchID>
export { SwitchID }
