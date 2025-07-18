import { Schema } from 'effect'

import PrivacyValue from './PrivacyValue.ts'

const GroupPrivacy = Schema.Struct({
  namePrivacy: Schema.propertySignature(PrivacyValue).pipe(Schema.fromKey('name_privacy')),
  descriptionPrivacy: Schema.propertySignature(PrivacyValue).pipe(
    Schema.fromKey('description_privacy')
  ),
  iconPrivacy: Schema.propertySignature(PrivacyValue).pipe(Schema.fromKey('icon_privacy')),
  listPrivacy: Schema.propertySignature(PrivacyValue).pipe(Schema.fromKey('list_privacy')),
  metadataPrivacy: Schema.propertySignature(PrivacyValue).pipe(Schema.fromKey('metadata_privacy')),
  visibility: PrivacyValue
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type GroupPrivacy = Schema.Schema.Type<typeof GroupPrivacy>

export default GroupPrivacy
