import { ErrorResponse } from './models/APIError.ts'

export class HTTPError extends Error {
  /** http status code */
  public status: number | undefined
  /** http status text */
  public statusText: string | undefined

  constructor (status: number, statusText?: string, content?: unknown, message?: string) {
    super(message ?? `HTTP Error ${status} ${statusText}: ${content}`)

    this.status = status
    this.statusText = statusText
  }

  static fromResponse (resp: Response, content?: unknown) {
    return new HTTPError(resp.status, resp.statusText, content)
  }
}

export class AuthorizationRequired extends Error {
  constructor () {
    super('tried to call method that requires authorization without a token')
  }
}

export class APIError extends HTTPError {
  /** code from the PluralKit api */
  public code: number | undefined
  /** message from the PluralKit api */
  public message: string

  constructor (resp: Response, apiResponse: ErrorResponse) {
    super(resp.status, resp.statusText, null,
      `API Error: HTTP ${resp.status} ${resp.statusText}, ` +
        `API ${apiResponse.code} ${apiResponse.message}`
    )

    this.code = apiResponse.code
    this.message = apiResponse.message
  }

  static fromResponse (resp: Response, json: unknown) {
    if (typeof json !== 'object' || json === null) {
      throw new TypeError(`Expected JSON object, got ${JSON.stringify(json)} instead`)
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
