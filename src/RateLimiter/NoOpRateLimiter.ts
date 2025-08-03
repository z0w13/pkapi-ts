import BaseRateLimiter from './BaseRateLimiter.ts'

export default class NoOpRateLimiter extends BaseRateLimiter {
  public async handleResponse (_bucket: string, _response: Response) {}
  public async handleError (_bucket: string, _error: unknown): Promise<boolean> {
    return false
  }

  public async wait (_bucket: string) {}
}
