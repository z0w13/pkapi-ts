import { Schema } from 'effect'

const IDPaddingFormat = Schema.Literal('none', 'left', 'right')
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type IDPaddingFormat = Schema.Schema.Type<typeof IDPaddingFormat>
export { IDPaddingFormat }

const ProxySwitchAction = Schema.Literal('off', 'new', 'add')
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type ProxySwitchAction = Schema.Schema.Type<typeof ProxySwitchAction>
export { ProxySwitchAction }

const SystemSettings = Schema.Struct({
  timezone: Schema.TimeZoneNamed,
  pingsEnabled: Schema.propertySignature(Schema.Boolean).pipe(Schema.fromKey('pings_enabled')),
  latchTimeout: Schema.propertySignature(Schema.NullOr(Schema.NonNegative)).pipe(
    Schema.fromKey('latch_timeout')
  ),
  memberDefaultPrivate: Schema.propertySignature(Schema.Boolean).pipe(
    Schema.fromKey('member_default_private')
  ),
  groupDefaultPrivate: Schema.propertySignature(Schema.Boolean).pipe(
    Schema.fromKey('group_default_private')
  ),
  showPrivateInfo: Schema.propertySignature(Schema.Boolean).pipe(
    Schema.fromKey('show_private_info')
  ),
  memberLimit: Schema.propertySignature(Schema.NonNegative).pipe(Schema.fromKey('memberLimit')),
  groupLimit: Schema.propertySignature(Schema.NonNegative).pipe(Schema.fromKey('groupLimit')),
  caseSensitiveProxyTags: Schema.propertySignature(Schema.Boolean).pipe(
    Schema.fromKey('case_sensitive_proxy_tags')
  ),
  proxyErrorMessageEnabled: Schema.propertySignature(Schema.Boolean).pipe(
    Schema.fromKey('proxy_error_message_enabled')
  ),
  hidDisplaySplit: Schema.propertySignature(Schema.Boolean).pipe(
    Schema.fromKey('hid_display_split')
  ),
  hidDisplayCaps: Schema.propertySignature(Schema.Boolean).pipe(Schema.fromKey('hid_display_caps')),
  hidListPadding: Schema.propertySignature(IDPaddingFormat).pipe(
    Schema.fromKey('hid_list_padding')
  ),
  proxySwitch: Schema.propertySignature(ProxySwitchAction).pipe(Schema.fromKey('proxy_switch')),
  nameFormat: Schema.propertySignature(Schema.String).pipe(Schema.fromKey('name_format'))
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SystemSettings = Schema.Schema.Type<typeof SystemSettings>
export default SystemSettings
