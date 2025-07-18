import { Schema } from 'effect'

const URL = Schema.String.pipe(
  Schema.filter((s) => {
    return !!global.URL.parse(s)
  })
)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type URL = Schema.Schema.Type<typeof URL>

export default URL
