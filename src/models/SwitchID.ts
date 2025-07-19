import z from 'zod'

const SwitchID = z.uuidv4().brand<'SwitchID'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SwitchID = z.infer<typeof SwitchID>
export { SwitchID }
