import { Schema } from 'effect'

const Color = Schema.String.pipe(
  Schema.length(6),
  Schema.filter((s) => {
    const intVal = parseInt(s, 16)
    return (!isNaN(intVal) && intVal >= 0 && intVal <= 16777215) || 'not a valid hex color'
  })
)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Color = Schema.Schema.Type<typeof Color>

export default Color
