import z from 'zod'
import { GuildSnowflake } from './DiscordSnowflake.ts'

const SystemGuildSettings = z.object({
  guildId: GuildSnowflake,
  proxyingEnabled: z.boolean(),
  tag: z.nullable(z.string().max(79)),
  tagEnabled: z.boolean()
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SystemGuildSettings = z.infer<typeof SystemGuildSettings>
export default SystemGuildSettings
