import { isSnowflake } from 'discord-snowflake'
import { Schema } from 'effect'

const DiscordSnowflake = Schema.String.pipe(
  Schema.filter((value) => isSnowflake(value) || 'not a discord snowflake'),
  Schema.brand('DiscordSnowflake')
)
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type DiscordSnowflake = Schema.Schema.Type<typeof DiscordSnowflake>
export default DiscordSnowflake
