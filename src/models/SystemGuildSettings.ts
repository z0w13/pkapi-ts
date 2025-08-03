import z from 'zod/v4'
import { GuildSnowflake } from './DiscordSnowflake.ts'

const SystemGuildSettings = z.object({
  proxyingEnabled: z.boolean(),
  tag: z.nullable(z.string().max(79)),
  tagEnabled: z.boolean()
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SystemGuildSettings = z.infer<typeof SystemGuildSettings>
export default SystemGuildSettings

const DispatchSystemGuildSettings = SystemGuildSettings.extend({
  guildId: GuildSnowflake,
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type DispatchSystemGuildSettings = z.infer<typeof DispatchSystemGuildSettings>
export { DispatchSystemGuildSettings }
