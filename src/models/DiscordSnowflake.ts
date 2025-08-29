import z from 'zod/v4'

const DiscordSnowflake = z
  .string()
  .refine(
    (value) => {
      try {
        return BigInt(value).toString() === value
      } catch (e) {
        return false
      }
    },
    { error: 'not a discord snowflake' }
  )
  .brand<'DiscordSnowflake'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type DiscordSnowflake = z.infer<typeof DiscordSnowflake>
export default DiscordSnowflake

const GuildSnowflake = DiscordSnowflake.brand<'GuildSnowflake'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type GuildSnowflake = z.infer<typeof GuildSnowflake>
export { GuildSnowflake }

const ChannelSnowflake = DiscordSnowflake.brand<'ChannelSnowflake'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type ChannelSnowflake = z.infer<typeof ChannelSnowflake>
export { ChannelSnowflake }

const UserSnowflake = DiscordSnowflake.brand<'UserSnowflake'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type UserSnowflake = z.infer<typeof UserSnowflake>
export { UserSnowflake }

const MessageSnowflake = DiscordSnowflake.brand<'MessageSnowflake'>()
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type MessageSnowflake = z.infer<typeof MessageSnowflake>
export { MessageSnowflake }
