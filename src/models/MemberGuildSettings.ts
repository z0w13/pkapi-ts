import z from 'zod/v4'

import { GuildSnowflake } from './DiscordSnowflake.ts'

const MemberGuildSettings = z.object({
  displayName: z.nullable(z.string().max(100)),
  avatarUrl: z.nullable(z.url().max(256)),
  keepProxy: z.nullable(z.boolean())
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type MemberGuildSettings = z.infer<typeof MemberGuildSettings>
export default MemberGuildSettings

const DispatchMemberGuildSettings = MemberGuildSettings.extend({
  guildId: GuildSnowflake,
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type DispatchMemberGuildSettings = z.infer<typeof DispatchMemberGuildSettings>
export { DispatchMemberGuildSettings }
