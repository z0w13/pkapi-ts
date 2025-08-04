import { vi, expect } from 'vitest'

expect.extend({
  async toResolveInstantly (received: Promise<any>) {
    let resolved = false
    received.then(() => (resolved = true))

    await vi.advanceTimersByTimeAsync(0)
    if (!resolved) {
      return {
        pass: false,
        message: () => `expected ${received} to resolve instantly but it didn't`,
      }
    }

    return {
      pass: true,
      message: () => `${received} resolved instantly`
    }
  },

  async toResolveAfterAtLeast (received: Promise<any>, timePassedMs: number) {
    const timeBefore = Date.now()
    let resolvedAt: number | null = null

    received.then(() => (resolvedAt = Date.now()))
    await vi.advanceTimersToNextTimerAsync()

    if (resolvedAt === null) {
      return {
        pass: false,
        message: () => `expected ${received} to resolve, but it never did`,
      }
    }

    const actualTimePassed = resolvedAt - timeBefore
    if (!resolvedAt || resolvedAt - timeBefore < timePassedMs) {
      return {
        pass: false,
        message: () =>
          `expected ${received} to resolve after at least ${timePassedMs}ms, but it resolved in ${actualTimePassed}ms`,
      }
    }

    return {
      pass: true,
      message: () => `${received} resolved after ${actualTimePassed}ms`,
    }
  },
})
