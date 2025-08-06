import z from 'zod/v4'

import PrivacyValue from './PrivacyValue.js'

const SystemPrivacy = z.object({
  namePrivacy: PrivacyValue,
  avatarPrivacy: PrivacyValue,
  descriptionPrivacy: PrivacyValue,
  bannerPrivacy: PrivacyValue,
  pronounPrivacy: PrivacyValue,
  memberListPrivacy: PrivacyValue,
  groupListPrivacy: PrivacyValue,
  frontPrivacy: PrivacyValue,
  frontHistoryPrivacy: PrivacyValue
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SystemPrivacy = z.infer<typeof SystemPrivacy>

export default SystemPrivacy
