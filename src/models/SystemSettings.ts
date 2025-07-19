import z from 'zod'

const IDPaddingFormat = z.literal(['none', 'left', 'right'])
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type IDPaddingFormat = z.infer<typeof IDPaddingFormat>
export { IDPaddingFormat }

const ProxySwitchAction = z.literal(['off', 'new', 'add'])
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type ProxySwitchAction = z.infer<typeof ProxySwitchAction>
export { ProxySwitchAction }

const SystemSettings = z.object({
  // TODO: Validate
  timezone: z.string(),
  pingsEnabled: z.boolean(),
  latchTimeout: z.nullable(z.int().min(0)),
  memberDefaultPrivate: z.boolean(),
  groupDefaultPrivate: z.boolean(),
  showPrivateInfo: z.boolean(),
  memberLimit: z.int().min(0),
  groupLimit: z.int().min(0),
  caseSensitiveProxyTags: z.boolean(),
  proxyErrorMessageEnabled: z.boolean(),
  hidDisplaySplit: z.boolean(),
  hidDisplayCaps: z.boolean(),
  hidListPadding: IDPaddingFormat,
  proxySwitch: ProxySwitchAction,
  nameFormat: z.string()
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SystemSettings = z.infer<typeof SystemSettings>
export default SystemSettings
