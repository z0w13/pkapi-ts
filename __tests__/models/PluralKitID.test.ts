import { test, describe, beforeEach, mock } from 'node:test'
import assert from 'node:assert'

import PluralKitID, { PluralKitIDFromString } from '../../src/models/PluralKitID.ts'
import { ZodError } from 'zod'

describe('PluralKitID', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    mock.reset()
  })

  for (const testCase of Object.entries({
    'ABC-DEF': 'abcdef',
    'AbC-DeF': 'abcdef',
    'abc-def': 'abcdef',
    ABCDE: 'abcde',
    ABCDEF: 'abcdef',
    abcde: 'abcde',
    abcdef: 'abcdef',
    AbCdEF: 'abcdef'
  })) {
    const [input, output] = testCase
    test(`${input} parses to ${output}`, () => {
      assert.equal(PluralKitIDFromString.parse(input), output)
    })
  }

  for (const input of ['ab-cde', 'abc-de', 'asdfasasdf', 'sdfasdf-sdfsafd']) {
    test(`${input} fails to parse`, () => {
      try {
        PluralKitIDFromString.parse(input)
      } catch (e) {
        assert.equal(e instanceof ZodError, true)
      }
    })
  }

  test('encodes correctly', () => {
    assert.equal(PluralKitID.parse('abcdef'), 'abcdef')
  })
})
