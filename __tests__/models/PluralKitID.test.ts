import { test, describe, beforeEach, mock } from 'node:test'
import assert from 'node:assert'

import PluralKitID, { PluralKitIDFromString } from '../../src/models/PluralKitID.ts'
import { Schema } from 'effect/index'
import { ParseError } from 'effect/ParseResult'

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
      assert.equal(Schema.decodeSync(PluralKitIDFromString)(input), output)
    })
  }

  for (const input of ['ab-cde', 'abc-de', 'asdfasasdf', 'sdfasdf-sdfsafd']) {
    test(`${input} fails to parse`, () => {
      try {
        Schema.decodeSync(PluralKitIDFromString)(input)
      } catch (e) {
        assert.equal(e instanceof ParseError, true)
      }
    })
  }

  test('encodes correctly', () => {
    assert.equal(Schema.encodeSync(PluralKitID)(PluralKitID.make('abcdef')), 'abcdef')
  })
})
