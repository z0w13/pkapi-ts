import { Schema } from 'effect'

import PrivacyValue from './PrivacyValue.ts'

const SystemPrivacy = Schema.Struct({
  descriptionPrivacy: Schema.propertySignature(PrivacyValue).pipe(
    Schema.fromKey('description_privacy')
  ),
  pronounPrivacy: Schema.propertySignature(PrivacyValue).pipe(Schema.fromKey('pronoun_privacy')),
  memberListPrivacy: Schema.propertySignature(PrivacyValue).pipe(
    Schema.fromKey('member_list_privacy')
  ),
  groupListPrivacy: Schema.propertySignature(PrivacyValue).pipe(
    Schema.fromKey('group_list_privacy')
  ),
  frontPrivacy: Schema.propertySignature(PrivacyValue).pipe(Schema.fromKey('front_privacy')),
  frontHistoryPrivacy: Schema.propertySignature(PrivacyValue).pipe(
    Schema.fromKey('front_history_privacy')
  )
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SystemPrivacy = Schema.Schema.Type<typeof SystemPrivacy>

export default SystemPrivacy
