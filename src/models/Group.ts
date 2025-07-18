import { Schema } from 'effect'

import Color from './Color.ts'
import URL from './URL.ts'
import { GroupIDFromString } from './GroupID.ts'
import { SystemIDFromString } from './SystemID.ts'
import GroupPrivacy from './GroupPrivacy.ts'

const Group = Schema.Struct({
  id: GroupIDFromString,
  uuid: Schema.UUID,
  system: Schema.UndefinedOr(SystemIDFromString),

  name: Schema.String.pipe(Schema.maxLength(100)),
  displayName: Schema.propertySignature(
    Schema.NullOr(Schema.String.pipe(Schema.maxLength(100)))
  ).pipe(Schema.fromKey('display_name')),
  description: Schema.NullOr(Schema.String.pipe(Schema.maxLength(100))),
  icon: Schema.NullOr(URL.pipe(Schema.maxLength(256))),
  banner: Schema.NullOr(URL.pipe(Schema.maxLength(256))),
  color: Schema.NullOr(Color),
  privacy: Schema.NullOr(GroupPrivacy)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type Group = Schema.Schema.Type<typeof Group>

export default Group
