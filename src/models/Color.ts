import z from 'zod'

const Color = z
  .string()
  .refine(
    (s) => {
      const intVal = parseInt(s, 16)
      return !isNaN(intVal) && intVal >= 0 && intVal <= 16777215
    },
    { error: 'not a valid hex color' }
  )
  .brand<'Color'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Color = z.infer<typeof Color>

export default Color
