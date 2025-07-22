import { expect, test, describe } from 'vitest'

import Color from '../../src/models/Color.ts'
import { ZodError } from 'zod'

describe('Birthday', () => {
  test('it parses correctly', () => {
    expect(Color.parse('FFFFFF')).toBe('FFFFFF')
  })
  test('fails on hex values that are too large', () => {
    expect(() => Color.parse('FFFFFFF')).toThrowError(ZodError)
  })
  test('fails on other strings', () => {
    expect(() => Color.parse('notacolor')).toThrowError(ZodError)
  })
})
