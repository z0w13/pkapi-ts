import { Schema } from 'effect'

import PrivacyValue from './PrivacyValue.ts'

const MemberPrivacy = Schema.Struct({
  visibility: PrivacyValue,
  namePrivacy: Schema.propertySignature(PrivacyValue).pipe(Schema.fromKey('name_privacy')),
  descriptionPrivacy: Schema.propertySignature(PrivacyValue).pipe(
    Schema.fromKey('description_privacy')
  ),
  birthdayPrivacy: Schema.propertySignature(PrivacyValue).pipe(Schema.fromKey('birthday_privacy')),
  pronounPrivacy: Schema.propertySignature(PrivacyValue).pipe(Schema.fromKey('pronoun_privacy')),
  avatarPrivacy: Schema.propertySignature(PrivacyValue).pipe(Schema.fromKey('avatar_privacy')),
  metadataPrivacy: Schema.propertySignature(PrivacyValue).pipe(Schema.fromKey('metadata_privacy')),
  proxyPrivacy: Schema.propertySignature(PrivacyValue).pipe(Schema.fromKey('proxy_privacy'))
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type MemberPrivacy = Schema.Schema.Type<typeof MemberPrivacy>

export default MemberPrivacy
