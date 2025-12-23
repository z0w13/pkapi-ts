import z from 'zod/v4'

export const IsoDateTimeToDateCodec = z.codec(z.union([z.iso.datetime(), z.date()]), z.date(), {
  decode: (isoOrDate) => (isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate)),
  encode: (date) => date.toISOString()
})
