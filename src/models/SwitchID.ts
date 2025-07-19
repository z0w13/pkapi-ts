import { Schema } from 'effect'

const SwitchID = Schema.UUID.pipe(Schema.brand('SwitchID'))
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SwitchID = Schema.Schema.Type<typeof SwitchID>
export { SwitchID }
