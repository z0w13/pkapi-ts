import BaseRateLimiter from './BaseRateLimiter.ts'

export default class NoOpRateLimiter extends BaseRateLimiter {
  public async handleResponse (_response: Response) {}
  public async handleError (_error: unknown): Promise<boolean> {
    return false
  }

  public async wait () {}
}
