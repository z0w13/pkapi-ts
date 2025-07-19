import { isSnowflake } from 'discord-snowflake'
import { Schema } from 'effect'

const DiscordSnowflake = Schema.String.pipe(
  Schema.filter((value) => isSnowflake(value) || 'not a discord snowflake'),
  Schema.brand('DiscordSnowflake')
)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type DiscordSnowflake = Schema.Schema.Type<typeof DiscordSnowflake>
export default DiscordSnowflake

const GuildSnowflake = DiscordSnowflake.pipe(Schema.brand('GuildSnowflake'))
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type GuildSnowflake = Schema.Schema.Type<typeof GuildSnowflake>
export { GuildSnowflake }

const ChannelSnowflake = DiscordSnowflake.pipe(Schema.brand('ChannelSnowflake'))
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type ChannelSnowflake = Schema.Schema.Type<typeof ChannelSnowflake>
export { ChannelSnowflake }

const MessageSnowflake = DiscordSnowflake.pipe(Schema.brand('MessageSnowflake'))
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type MessageSnowflake = Schema.Schema.Type<typeof MessageSnowflake>
export { MessageSnowflake }
