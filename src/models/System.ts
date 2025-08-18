import z from 'zod/v4'

import Color from './Color.js'
import { SystemIDFromString, SystemUUID } from './SystemID.js'
import SystemPrivacy from './SystemPrivacy.js'

const System = z.object({
  id: SystemIDFromString,
  uuid: SystemUUID,

  name: z.nullable(z.string().max(100)),
  description: z.nullable(z.string().max(1000)),
  tag: z.nullable(z.string().max(79)),
  pronouns: z.nullable(z.string().max(100)),
  avatarUrl: z.nullable(z.url().max(256)),
  banner: z.nullable(z.url().max(256)),
  color: z.nullable(Color),
  created: z.date(),
  webhookUrl: z.optional(z.nullable(z.url())),
  privacy: z.nullable(SystemPrivacy)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type System = z.infer<typeof System>
export default System

export const SystemFromApi = System.extend({
  created: z.iso.datetime().transform((v) => new Date(v))
})

const SimpleSystem = System.extend({
  id: z.string(),
  uuid: z.uuid(),
})
// eslint-disable-next-line @typescript-eslint/no-redeclare -- needed for type information
type SimpleSystem = z.infer<typeof SimpleSystem>
export { SimpleSystem }
