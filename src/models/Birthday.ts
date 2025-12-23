import z from 'zod/v4'

export const BirthdayString = z
  .string()
  .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, { error: 'not a string in YYYY-MM-DD format' })
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
export type BirthdayString = z.infer<typeof BirthdayString>

export const BirthdayObject = z.object({
  year: z.number().nullable(),
  month: z.number(),
  day: z.number()
})

// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
export type BirthdayObject = z.infer<typeof BirthdayObject>

const Birthday = z.codec(BirthdayString, BirthdayObject, {
  decode: (birthdayString) => {
    const split = birthdayString.split('-')
    const [year, month, day] = [parseInt(split[0]), parseInt(split[1]), parseInt(split[2])]

    return {
      // NOTE: 0004 = hides the year
      //       see https://pluralkit.me/api/models/#member-model
      year: year === 4 ? null : year,
      month,
      day
    }
  },
  encode: (birthday) =>
    `${(birthday.year ? birthday.year : 4).toString().padStart(4, '0')}` +
    `-${birthday.month.toString().padStart(2, '0')}` +
    `-${birthday.day.toString().padStart(2, '0')}`
})

// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Birthday = z.infer<typeof Birthday>
export default Birthday
