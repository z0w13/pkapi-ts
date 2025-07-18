import { Schema } from 'effect'

import Color from './Color.ts'
import URL from './URL.ts'
import { SystemIDFromString } from './SystemID.ts'
import SystemPrivacy from './SystemPrivacy.ts'

const System = Schema.Struct({
  id: SystemIDFromString,
  uuid: Schema.UUID,

  // TODO: Fix when the documentation updates
  //       see https://github.com/PluralKit/PluralKit/pull/751
  name: Schema.NullOr(Schema.String.pipe(Schema.maxLength(100))),
  description: Schema.NullOr(Schema.String.pipe(Schema.maxLength(1000))),
  tag: Schema.NullOr(Schema.String.pipe(Schema.maxLength(79))),
  pronouns: Schema.NullOr(Schema.String.pipe(Schema.maxLength(100))),
  avatarUrl: Schema.propertySignature(Schema.NullOr(URL.pipe(Schema.maxLength(256)))).pipe(
    Schema.fromKey('avatar_url')
  ),
  banner: Schema.NullOr(URL.pipe(Schema.maxLength(256))),
  color: Schema.NullOr(Color),
  created: Schema.NullOr(Schema.DateFromString),
  privacy: Schema.NullOr(SystemPrivacy)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type System = Schema.Schema.Type<typeof System>

export default System
