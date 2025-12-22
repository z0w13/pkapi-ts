import { expect, test, describe } from 'vitest'

import AutoproxySettings from '../../../../src/models/AutoproxySettings.js'
import { ZodError } from 'zod/v4'

describe('AutoproxySettings', () => {
  test('it parses correctly', () => {
    expect(
      AutoproxySettings.parse({
        guildId: '1',
        autoproxyMode: 'member',
        autoproxyMember: null,
        lastLatchTimestamp: null
      })
    ).toStrictEqual({
      guildId: '1',
      autoproxyMode: 'member',
      autoproxyMember: null,
      lastLatchTimestamp: null
    })
  })
  test("fails when autoproxyMode = 'front' and a autoproxyMode is not null", () => {
    expect(() =>
      AutoproxySettings.parse({
        guildId: '1',
        autoproxyMode: 'front',
        autoproxyMember: 'member',
        lastLatchTimestamp: null
      })
    ).toThrowError(ZodError)
  })
  test('fails on invalid objects', () => {
    expect(() => AutoproxySettings.parse({})).toThrowError(ZodError)
  })
})
