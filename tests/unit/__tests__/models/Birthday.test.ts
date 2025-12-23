import { expect, test, describe } from 'vitest'

import Birthday from '../../../../src/models/Birthday.js'
import { ZodError } from 'zod/v4'

describe('Birthday', () => {
  describe('encode', () => {
    test('encodes correctly', () => {
      expect(Birthday.encode({ year: 2004, month: 1, day: 1 })).toBe('2004-01-01')
    })
    test('encodes a birthday without year correctly', () => {
      expect(Birthday.encode({ year: null, month: 1, day: 1 })).toBe('0004-01-01')
    })
  })
  describe('decode', () => {
    test('decodes a birthday without year correctly', () => {
      expect(Birthday.decode('0004-01-01')).toStrictEqual({ year: null, month: 1, day: 1 })
    })
    test('fails on invalid strings', () => {
      expect(() => Birthday.decode('00-00-00')).toThrowError(ZodError)
    })
  })
})
