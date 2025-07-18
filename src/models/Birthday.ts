import { ParseResult, Schema } from 'effect'
import { isNonEmptyArray } from 'effect/Array'
import { ParseIssue } from 'effect/ParseResult'

const Birthday = Schema.Struct({
  year: Schema.NullOr(Schema.Number),
  month: Schema.Number,
  day: Schema.Number
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Birthday = Schema.Schema.Type<typeof Birthday>

export const BirthdayFromString = Schema.compose(
  Schema.NonEmptyString.pipe(Schema.pattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)).annotations({
    message: () => 'not a string in YYYY-MM-DD format'
  }),
  Schema.transformOrFail(Schema.String, Birthday, {
    strict: true,
    decode: (input, _options, ast) => {
      const split = input.split('-')
      const [year, month, day] = [parseInt(split[0]), parseInt(split[1]), parseInt(split[2])]

      const issues: Array<ParseIssue> = []
      if (isNaN(year)) {
        issues.push(new ParseResult.Type(ast, split[0], `Couldn't parse month: '${split[0]}'`))
      }

      if (isNaN(month)) {
        issues.push(new ParseResult.Type(ast, split[1], `Couldn't parse month: '${split[1]}'`))
      }

      if (isNaN(day)) {
        issues.push(new ParseResult.Type(ast, split[2], `Couldn't parse day: '${split[2]}'`))
      }

      return isNonEmptyArray(issues)
        ? ParseResult.fail(new ParseResult.Composite(ast, input, issues))
        : ParseResult.succeed({
            // NOTE: 0004 = hides the year
            //       see https://pluralkit.me/api/models/#member-model
            year: year === 4 ? null : year,
            month,
            day
          })
    },
    encode: (input, _options, _ast) =>
      ParseResult.succeed(
        `${String(input.year ?? 4).padStart(4, '0')}-` +
          `${input.month.toString().padStart(2, '0')}-` +
          `${input.day.toString().padStart(2, '0')}`
      )
  })
)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
export type BirthdayFromString = Schema.Schema.Type<typeof BirthdayFromString>

export default Birthday
