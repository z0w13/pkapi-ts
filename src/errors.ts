import { ErrorResponse } from './models/APIError.ts'

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

export class APIError extends Error {
  constructor (resp: Response, apiResponse: ErrorResponse) {
    super(
      `API Error: HTTP ${resp.status} ${resp.statusText}, ` +
        `API ${apiResponse.code} ${apiResponse.message}`
    )
  }

  static fromResponse (resp: Response, json: unknown) {
    if (typeof json !== 'object' || json === null) {
      // TODO: Error parsing specific error
      throw new Error(`Expected JSON object, got ${JSON.stringify(json)} instead`)
    }

    return new APIError(resp, ErrorResponse.parse(json))
  }

  static isAPIErrorStatus (status: number): boolean {
    // https://pluralkit.me/api/errors/#json-error-codes
    return [
      400, 401, 403, 404,
      // Awaiting docs update from PR https://github.com/PluralKit/PluralKit/pull/754
      501
    ].includes(status)
  }
}
