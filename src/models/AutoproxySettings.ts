import z from 'zod/v4'

import { ChannelSnowflake, GuildSnowflake } from './DiscordSnowflake.js'
import MemberID from './MemberID.js'

const AutoproxyMode = z.literal(['off', 'front', 'latch', 'member'])
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type AutoproxyMode = z.infer<typeof AutoproxyMode>
export { AutoproxyMode }

const AutoproxySettings = z
  .object({
    guildId: z.optional(GuildSnowflake),
    channelId: z.optional(ChannelSnowflake),
    autoproxyMode: AutoproxyMode,
    autoproxyMember: z.nullable(MemberID),
    lastLatchTimestamp: z.nullable(z.date())
  })
  .refine((v) => !(v.autoproxyMode === 'front' && v.autoproxyMember !== null), {
    error: 'autoproxyMember must be `null` if autoproxyMode is set to `front`'
  })
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type AutoproxySettings = z.infer<typeof AutoproxySettings>
export default AutoproxySettings

export const AutoproxySettingsFromApi = AutoproxySettings.extend({
  lastLatchTimestamp: z.nullable(z.iso.datetime().transform((v) => new Date(v)))
})
