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
