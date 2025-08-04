import { expect, test, describe } from 'vitest'

import Birthday, { BirthdayFromString, BirthdayToString } from '../../../../src/models/Birthday.js'
import { ZodError } from 'zod/v4'

describe('Birthday', () => {
  test('it parses correctly', () => {
    expect(Birthday.parse({ year: null, month: 1, day: 1 })).toStrictEqual(
      { year: null, month: 1, day: 1 }
    )
  })
  test('fails on invalid objects', () => {
    expect(() => Birthday.parse({})).toThrowError(ZodError)
  })
})

describe('BirthdayToString', () => {
  test('parses a birthday correctly', () => {
    expect(BirthdayToString.parse({ year: 2004, month: 1, day: 1 })).toBe(
      '2004-01-01'
    )
  })
  test('parses a birthday without year correctly', () => {
    expect(BirthdayToString.parse({ year: null, month: 1, day: 1 })).toBe(
      '0004-01-01'
    )
  })
})
describe('BirthdayFromString', () => {
  test('parses a birthday without year correctly', () => {
    expect(BirthdayFromString.parse('0004-01-01')).toStrictEqual(
      { year: null, month: 1, day: 1 }
    )
  })
  test('fails on invalid strings', () => {
    expect(() => BirthdayFromString.parse('00-00-00')).toThrowError(ZodError)
  })
})
