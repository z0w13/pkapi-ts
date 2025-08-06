import z from 'zod/v4'

import PrivacyValue from './PrivacyValue.js'

const MemberPrivacy = z.object({
  visibility: PrivacyValue,
  namePrivacy: PrivacyValue,
  descriptionPrivacy: PrivacyValue,
  bannerPrivacy: PrivacyValue,
  birthdayPrivacy: PrivacyValue,
  pronounPrivacy: PrivacyValue,
  avatarPrivacy: PrivacyValue,
  metadataPrivacy: PrivacyValue,
  proxyPrivacy: PrivacyValue
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type MemberPrivacy = z.infer<typeof MemberPrivacy>

export default MemberPrivacy
