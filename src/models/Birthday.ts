import z from 'zod'

const Birthday = z.object({
  year: z.number().nullable(),
  month: z.number(),
  day: z.number()
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Birthday = z.infer<typeof Birthday>

// TODO: Convert Birthday <-> string
export const BirthdayFromString = z
  .string()
  .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, { error: 'not a string in YYYY-MM-DD format' })
  .transform((input, ctx) => {
    const split = input.split('-')
    const [year, month, day] = [parseInt(split[0]), parseInt(split[1]), parseInt(split[2])]

    if (isNaN(year)) {
      ctx.addIssue(`Couldn't parse month: '${split[0]}'`)
    }

    if (isNaN(month)) {
      ctx.addIssue(`Couldn't parse month: '${split[1]}'`)
    }

    if (isNaN(day)) {
      ctx.addIssue(`Couldn't parse day: '${split[2]}'`)
    }

    if (ctx.issues.length > 0) {
      return z.NEVER
    }

    return ctx.issues.length > 0
      ? z.NEVER
      : {
          // NOTE: 0004 = hides the year
          //       see https://pluralkit.me/api/models/#member-model
          year: year === 4 ? null : year,
          month,
          day
        }
  })
  .pipe(Birthday)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
export type BirthdayFromString = z.infer<typeof BirthdayFromString>

export default Birthday
