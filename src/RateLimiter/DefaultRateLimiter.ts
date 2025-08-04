import BaseRateLimiter from './BaseRateLimiter.js'

interface RateLimiterOptions {
  // Print debug info
  debug?: boolean;
  // Base window to use for increasing/decreasing the wait time
  errorWindowBase?: number;
  // Time we initially wait when we hit the ratelimit
  initialWaitTime?: number;
  // Lowest our wait time can go
  minWait?: number;
  // Highest the wait time can go
  maxWait?: number;
  // How much to change the wait time by when increase/decrease thresholds are hit
  increment?: number;
  // Min amount of errors in the last (errorWindowBase * waitTime) ms to increase wait time
  increaseThreshold?: number;
  // Max amount of errors in the last (errorWindowBase * waitTime) ms to allow decreasing wait time
  decreaseThreshold?: number;
}

const DEFAULT_OPTIONS: Required<RateLimiterOptions> = {
  debug: false,
  errorWindowBase: 5,
  initialWaitTime: 1000,
  minWait: 1000,
  maxWait: 3000,
  increment: 500,
  increaseThreshold: 3,
  decreaseThreshold: 0,
}

export class Bucket {
  protected name: string

  // Array of timestamps when we triggered a 429
  protected errorTimestamps: Array<number>
  // Timestamp when our rate limit is reset (including our own waitTime)
  protected resetTimestamp: number
  // Time we wait when we hit the ratelimit
  protected waitTime: number

  protected options: Required<RateLimiterOptions>

  constructor (
    name: string,
    options: RateLimiterOptions = {}
  ) {
    this.name = name
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    }
    this.waitTime = this.options.initialWaitTime
    this.errorTimestamps = []
    this.resetTimestamp = 0
  }

  private adjustWaitTime () {
    const curTime = Date.now()
    this.errorTimestamps = this.errorTimestamps.filter(
      (v) => v > curTime - this.options.errorWindowBase * this.options.minWait
    )

    // If we hit the rate limit more than `increaseThreshold` times
    // in the last `errorWindowBase * minWait` seconds we increase the delay
    // up to a maximum of `maxWait`
    if (
      this.errorTimestamps.length >= this.options.increaseThreshold &&
      this.waitTime !== this.options.maxWait
    ) {
      this.waitTime = Math.min(
        this.waitTime + this.options.increment,
        this.options.maxWait
      )
      this.debugLog(
        `ratelimit: error threshold exceeded, increased wait time to ${this.waitTime}ms`
      )
    } else if (
      this.errorTimestamps.length <= this.options.decreaseThreshold &&
      this.waitTime !== this.options.minWait
    ) {
      this.waitTime = Math.max(
        this.waitTime - this.options.increment,
        this.options.minWait
      )
      this.debugLog(
        `ratelimit: error threshold reset, decreased wait time to ${this.waitTime}ms`
      )
    }
  }

  private parseHeaders (headers: Headers): {
    limit?: number;
    remaining?: number;
    reset?: number;
  } | null {
    if (!headers) {
      return null
    }

    if (typeof headers !== 'object') {
      return null
    }

    const parsed: { limit?: number; remaining?: number; reset?: number } = {}

    if (headers.has('x-ratelimit-limit')) {
      const limit = parseInt(headers.get('x-ratelimit-limit')!)
      if (!isNaN(limit)) {
        parsed.limit = limit
      }
    }

    if (headers.has('x-ratelimit-remaining')) {
      const limit = parseInt(headers.get('x-ratelimit-remaining')!)
      if (!isNaN(limit)) {
        parsed.remaining = limit
      }
    }

    if (headers.has('x-ratelimit-reset')) {
      const reset = parseInt(headers.get('x-ratelimit-reset')!)
      if (!isNaN(reset)) {
        parsed.reset = reset
      }
    }

    return parsed
  }

  private debugLog (data: unknown) {
    if (this.options.debug) {
      console.debug({ bucket: this.name }, data)
    }
  }

  private isRateLimitError (res: Response) {
    return res.status === 429
  }

  private handleResult (res: Response) {
    // Handle incremental backoff when ratelimited
    this.adjustWaitTime()

    const headers = this.parseHeaders(res.headers)
    this.debugLog({ headers })
    if (
      (headers?.remaining !== undefined && headers.remaining < 1) ||
      this.isRateLimitError(res)
    ) {
      const resetMs = headers?.reset
        ? Math.max(headers.reset * 1000 - Date.now(), this.waitTime)
        : this.waitTime
      const type = this.isRateLimitError(res) ? 'triggered' : 'hit'
      this.debugLog(
        `ratelimit: ${type}, need to wait for ${resetMs} milliseconds`
      )
      this.resetTimestamp = Date.now() + resetMs
    }
  }

  public async handleError (error: unknown): Promise<boolean> {
    if (error instanceof Response) {
      if (this.isRateLimitError(error)) {
        this.errorTimestamps.push(Date.now())
      }

      this.handleResult(error)
      return this.isRateLimitError(error)
    }

    return false
  }

  public async handleResponse (res: Response) {
    this.handleResult(res)
  }

  public async wait () {
    const waitTime = this.resetTimestamp - Date.now()
    this.debugLog({
      waitTime,
      resetTimestamp: this.resetTimestamp,
      now: Date.now(),
    })
    if (waitTime <= 0) {
      return
    }

    return new Promise<void>((resolve) => setTimeout(resolve, waitTime))
  }
}

export default class DefaultRateLimiter extends BaseRateLimiter {
  protected options: Required<RateLimiterOptions>
  protected buckets: Map<string, Bucket>

  constructor (options: RateLimiterOptions = {}) {
    super()

    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    }

    this.buckets = new Map<string, Bucket>()
  }

  protected getBucket (name: string): Bucket {
    if (!this.buckets.has(name)) {
      this.buckets.set(name, new Bucket(name, this.options))
    }

    return this.buckets.get(name)!
  }

  public async handleError (bucket: string, error: unknown): Promise<boolean> {
    return this.getBucket(bucket).handleError(error)
  }

  public async handleResponse (bucket: string, res: Response) {
    return this.getBucket(bucket).handleResponse(res)
  }

  public async wait (bucket: string) {
    return this.getBucket(bucket).wait()
  }
}
