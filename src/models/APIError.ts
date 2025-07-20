import z from 'zod'

// https://pluralkit.me/api/errors/#error-object
const ErrorObject = z.object({
  message: z.string(),
  maxLength: z.optional(z.int()),
  actualLength: z.optional(z.int())
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type ErrorObject = z.infer<typeof ErrorObject>
export { ErrorObject }

// https://pluralkit.me/api/errors/#error-response-model
const ErrorResponse = z.object({
  code: z.int(),
  message: z.string(),
  errors: z.optional(z.record(z.string(), ErrorObject)),
  retryAfter: z.optional(z.int())
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type ErrorResponse = z.infer<typeof ErrorResponse>
export { ErrorResponse }

export default class APIError extends Error {
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
