import z from 'zod/v4'

import SystemSettings from './SystemSettings.ts'

const PublicSystemSettings = SystemSettings.pick({
  pingsEnabled: true,
  latchTimeout: true,
  caseSensitiveProxyTags: true,
  proxyErrorMessageEnabled: true,
  hidDisplaySplit: true,
  hidDisplayCaps: true,
  hidListPadding: true,
  proxySwitch: true,
  nameFormat: true
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type PublicSystemSettings = z.infer<typeof PublicSystemSettings>
export default PublicSystemSettings
