import { Schema } from 'effect'

const ProxyTag = Schema.Struct({
  prefix: Schema.NullOr(Schema.String),
  suffix: Schema.NullOr(Schema.String)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type ProxyTag = Schema.Schema.Type<typeof ProxyTag>

export default ProxyTag
