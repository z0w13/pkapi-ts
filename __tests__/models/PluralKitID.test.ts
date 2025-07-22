import { assert, test, describe } from 'vitest'

import PluralKitID, { PluralKitIDFromString } from '../../src/models/PluralKitID.ts'
import { ZodError } from 'zod'

describe('PluralKitID', () => {
  test.each([
    ['ABC-DEF', 'abcdef'],
    ['AbC-DeF', 'abcdef'],
    ['abc-def', 'abcdef'],
    ['ABCDE', 'abcde'],
    ['ABCDEF', 'abcdef'],
    ['abcde', 'abcde'],
    ['abcdef', 'abcdef'],
    ['AbCdEF', 'abcdef']
  ])('%s parses to %s', (input, expected) => {
    assert.equal(PluralKitIDFromString.parse(input), expected)
  })

  test.each(['ab-cde', 'abc-de', 'asdfasasdf', 'sdfasdf-sdfsafd'])('%s fails to parse', (input) => {
    try {
      PluralKitIDFromString.parse(input)
    } catch (e) {
      assert.equal(e instanceof ZodError, true)
    }
  })

  test('encodes correctly', () => {
    assert.equal(PluralKitID.parse('abcdef'), 'abcdef')
  })
})
