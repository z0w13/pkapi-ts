import { assert, test, describe } from 'vitest'

import StrictTypedClient from '../src/StrictTypedClient.ts'
import { GuildSnowflake } from '../src/models/DiscordSnowflake.ts'
import { AuthorizationRequired } from '../src/errors.ts'

describe('PluralKit', () => {
  test('throws when a method that requires token is called without token', async () => {
    const pluralKit = new StrictTypedClient()
    try {
      await pluralKit.getOwnSystemAutoproxySettings(GuildSnowflake.parse('0'))
    } catch (e) {
      assert(e instanceof AuthorizationRequired)
    }
  })
})
