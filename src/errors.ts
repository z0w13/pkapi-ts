export class HTTPError extends Error {
  constructor (status: number, statusText?: string, content?: unknown) {
    super(`HTTP Error ${status} ${statusText}: ${content}`)
  }

  static async fromResponse (resp: Response) {
    return new HTTPError(resp.status, resp.statusText, await resp.text())
  }
}

export class AuthorizationRequired extends Error {
  constructor () {
    super('tried to call method that requires authorization without a token')
  }
}
