import { assert, test, describe } from 'vitest'

import { SystemRef } from '../../../../src/models/SystemID.js'
import { ZodError } from 'zod/v4'

describe('SystemRef', () => {
  test('handles UUIDs', () => {
    assert.equal(
      SystemRef.parse('b1646a57-f1c0-4075-9810-b44760efeca2'),
      'b1646a57-f1c0-4075-9810-b44760efeca2'
    )
  })

  test('errors on anything else', () => {
    try {
      SystemRef.parse('clearly not a valid systemref')
    } catch (e) {
      console.info(e)
      assert.equal(e instanceof ZodError, true)
    }
  })

  test('handles short IDs', () => {
    assert.equal(SystemRef.parse('exmpl'), 'exmpl')
  })

  test('handles discord snowflakes', () => {
    assert.equal(SystemRef.parse('466378653216014359'), '466378653216014359')
  })
})
