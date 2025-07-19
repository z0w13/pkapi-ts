import z from 'zod'

const ProxyTag = z.object({
  prefix: z.nullable(z.string()),
  suffix: z.nullable(z.string())
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type ProxyTag = z.infer<typeof ProxyTag>

export default ProxyTag
