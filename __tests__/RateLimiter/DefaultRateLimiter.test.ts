import { vi, describe, expect, it } from 'vitest'

import DefaultRateLimiter from '../../src/RateLimiter/DefaultRateLimiter.ts'

class TestRateLimiter extends DefaultRateLimiter {
  public setErrorTimestamps (timestamps: Array<number>) {
    this.errorTimestamps = timestamps
  }

  public async triggerError () {
    return this.handleError(new Response(null, { status: 429 }))
  }

  public getWaitTime () {
    return this.waitTime
  }

  public getResetTimestamp () {
    return this.resetTimestamp
  }
}

describe('DefaultRateLimiter', function () {
  describe('waitTime', function () {
    it('increases the wait time if we exceed the max error threshold', async function () {
      const limiter = new TestRateLimiter()

      await limiter.triggerError()
      await limiter.triggerError()
      await limiter.triggerError()

      expect(limiter.getWaitTime()).toBe(1500)
    })
    it('decreases the wait time if we drop below the min threshold', async function () {
      const limiter = new TestRateLimiter({
        errorWindowBase: 5000,
        initialWaitTime: 2000,
      })

      limiter.setErrorTimestamps([0, 1, 2])
      await limiter.handleResponse(new Response())

      expect(limiter.getWaitTime()).toBe(1500)
    })
    it('does not exceed maxWait', async function () {
      const limiter = new TestRateLimiter({
        maxWait: 3000,
        initialWaitTime: 2000,
        increment: 500,
      })

      await limiter.triggerError()
      await limiter.triggerError()
      await limiter.triggerError()
      await limiter.triggerError()
      await limiter.triggerError()

      expect(limiter.getWaitTime()).toBe(3000)
    })
    it('does not go below minWait', async function () {
      const limiter = new TestRateLimiter({
        minWait: 1000,
        initialWaitTime: 2000,
        increment: 500,
      })

      await limiter.handleResponse(new Response())
      await limiter.handleResponse(new Response())
      await limiter.handleResponse(new Response())

      expect(limiter.getWaitTime()).toBe(1000)
    })
  })
  describe('wait', function () {
    it("waits if there's no remaining requests", async function () {
      vi.useFakeTimers()

      const limiter = new TestRateLimiter({
        errorWindowBase: 5000,
        initialWaitTime: 1000,
      })
      // trigger the ratelimiter by setting remaining requests to 0
      await limiter.handleResponse(
        new Response(null, {
          headers: { 'x-ratelimit-remaining': '0' },
        })
      )

      await expect(limiter.wait()).toResolveAfterAtLeast(1000)
    })
    it('waits if a rate limit error was triggered', async function () {
      vi.useFakeTimers()

      const limiter = new TestRateLimiter({ initialWaitTime: 1000 })
      // trigger an error to ratelimit the next request
      await limiter.triggerError()

      await expect(limiter.wait()).toResolveAfterAtLeast(1000)
    })
    it("immediately returns if there's no ratelimiting", async function () {
      vi.useFakeTimers()
      const limiter = new TestRateLimiter({ initialWaitTime: 1000 })
      await expect(limiter.wait()).toResolveAfterAtLeast(0)
    })
    it('respects x-ratelimit-reset headers from API responses', async function () {
      vi.useFakeTimers()

      const limiter = new TestRateLimiter()
      await limiter.handleResponse(
        new Response(null, {
          headers: {
            'x-ratelimit-remaining': '0',
            'x-ratelimit-reset': (Math.ceil(Date.now() / 1000) + 60).toString(),
          }
        })
      )

      await expect(limiter.wait()).toResolveAfterAtLeast(60000)
    })
    it('respects x-ratelimit-reset headers from API errors', async function () {
      vi.useFakeTimers()

      const limiter = new TestRateLimiter()
      await limiter.handleError(
        new Response(null, {
          status: 429,
          headers: {
            'x-ratelimit-remaining': '0',
            'x-ratelimit-reset': (Math.ceil(Date.now() / 1000) + 60).toString(),
          }
        })
      )

      await expect(limiter.wait()).toResolveAfterAtLeast(60000)
    })
  })
  describe('handleError', function () {
    it('returns true on errors related to ratelimiting', async function () {
      const limiter = new TestRateLimiter()
      expect(await limiter.handleError(new Response(null, { status: 429 }))).toBe(true)
    })
    it('returns false on errors unrelated to ratelimiting', async function () {
      const limiter = new TestRateLimiter()
      expect(await limiter.handleError('unrelated')).toBe(false)
    })
    it('respects the x-ratelimit-remaining header in API responses', async function () {
      vi.useFakeTimers()

      const limiter = new TestRateLimiter({
        errorWindowBase: 5000,
        initialWaitTime: 1000,
      })
      // trigger the ratelimiter by setting remaining requests to 0
      await limiter.handleError(
        new Response(null, {
          status: 404,
          headers: { 'x-ratelimit-remaining': '0' },
        })
      )

      await expect(limiter.wait()).toResolveAfterAtLeast(1000)
    })
  })
})
