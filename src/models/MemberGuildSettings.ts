import z from 'zod'

import { GuildSnowflake } from './DiscordSnowflake.ts'

const MemberGuildSettings = z.object({
  guildId: GuildSnowflake,
  displayName: z.nullable(z.string().max(100)),
  avatarUrl: z.nullable(z.url().max(256)),
  keepProxy: z.boolean()
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type MemberGuildSettings = z.infer<typeof MemberGuildSettings>
export default MemberGuildSettings
