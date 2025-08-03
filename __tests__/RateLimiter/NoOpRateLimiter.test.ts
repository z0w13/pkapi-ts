import { vi, describe, expect, it } from 'vitest'

import NoOpRateLimiter from '../../src/RateLimiter/NoOpRateLimiter.ts'

describe('NoOpRateLimiter', function () {
  describe('handleError', function () {
    it.each([new Response(null, { status: 429 }), 'random-value'])(
      'returns false with handleError(%j)',
      async function (err) {
        const limiter = new NoOpRateLimiter()
        expect(await limiter.handleError(err)).toBe(false)
      }
    )
  })
  describe('handleResponse', function () {
    it('immediately returns', async function () {
      vi.useFakeTimers()
      const limiter = new NoOpRateLimiter()

      // set done to true after waiting for the ratelimiter
      let done = false
      limiter.handleResponse(new Response()).then(() => (done = true))

      await vi.advanceTimersByTimeAsync(0)
      expect(done).toBe(true)
    })
  })
  describe('take', function () {
    it('immediately returns', async function () {
      vi.useFakeTimers()
      const limiter = new NoOpRateLimiter()

      // set done to true after waiting for the ratelimiter
      let done = false
      limiter.wait().then(() => (done = true))

      await vi.advanceTimersByTimeAsync(0)
      expect(done).toBe(true)
    })
  })
})
