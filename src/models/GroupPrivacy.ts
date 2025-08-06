import z from 'zod/v4'

import PrivacyValue from './PrivacyValue.js'

const GroupPrivacy = z.object({
  namePrivacy: PrivacyValue,
  descriptionPrivacy: PrivacyValue,
  bannerPrivacy: PrivacyValue,
  iconPrivacy: PrivacyValue,
  listPrivacy: PrivacyValue,
  metadataPrivacy: PrivacyValue,
  visibility: PrivacyValue
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type GroupPrivacy = z.infer<typeof GroupPrivacy>

export default GroupPrivacy
