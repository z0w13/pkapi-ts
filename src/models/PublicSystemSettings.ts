import { Schema } from 'effect'
import SystemSettings from './SystemSettings.ts'

const PublicSystemSettings = SystemSettings.pick(
  'pingsEnabled',
  'latchTimeout',
  'caseSensitiveProxyTags',
  'proxyErrorMessageEnabled',
  'hidDisplaySplit',
  'hidDisplayCaps',
  'hidListPadding',
  'proxySwitch',
  'nameFormat'
)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type PublicSystemSettings = Schema.Schema.Type<typeof PublicSystemSettings>
export default PublicSystemSettings
