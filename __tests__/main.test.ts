import { test, describe, beforeEach, mock } from 'node:test'
import assert from 'node:assert'

import PluralKit from '../src/main.ts'
import { GuildSnowflake } from '../src/models/DiscordSnowflake.ts'
import { AuthorizationRequired } from '../src/errors.ts'

describe('PluralKit', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    mock.reset()
  })

  test('throws when a method that requires token is called without token', async () => {
    const pluralKit = new PluralKit()
    try {
      await pluralKit.getOwnSystemAutoproxySettings(GuildSnowflake.parse('0'))
    } catch (e) {
      assert(e instanceof AuthorizationRequired)
    }
  })
})
