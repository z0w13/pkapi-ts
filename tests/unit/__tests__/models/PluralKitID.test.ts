import { assert, test, describe } from 'vitest'

import PluralKitID from '../../../../src/models/PluralKitID.js'
import { ZodError } from 'zod/v4'

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
  ])('%s decodes to %s', (input, expected) => {
    assert.equal(PluralKitID.decode(input), expected)
  })

  test.each(['ab-cde', 'abc-de', 'asdfasasdf', 'sdfasdf-sdfsafd'])(
    '%s fails to decode',
    (input) => {
      try {
        PluralKitID.decode(input)
      } catch (e) {
        assert.equal(e instanceof ZodError, true)
      }
    }
  )

  test('encodes correctly', () => {
    assert.equal(PluralKitID.parse('abcdef'), 'abcdef')
  })
})
