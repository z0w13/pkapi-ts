import { vi, describe, expect, it } from 'vitest'

import NoOpRateLimiter from 'src/RateLimiter/NoOpRateLimiter.js'

describe('NoOpRateLimiter', function () {
  describe('handleError', function () {
    it.each([new Response(null, { status: 429 }), 'random-value'])(
      'returns false with handleError(%j)',
      async function (err) {
        const limiter = new NoOpRateLimiter()
        expect(await limiter.handleError('bucket', err)).toBe(false)
      }
    )
  })
  describe('handleResponse', function () {
    it('immediately returns', async function () {
      vi.useFakeTimers()
      const limiter = new NoOpRateLimiter()

      await expect(
        limiter.handleResponse('bucket', new Response())
      ).toResolveInstantly()
    })
  })
  describe('take', function () {
    it('immediately returns', async function () {
      vi.useFakeTimers()
      const limiter = new NoOpRateLimiter()

      await expect(limiter.wait('bucket')).toResolveInstantly()
    })
  })
})
