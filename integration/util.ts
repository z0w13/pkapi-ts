import { Client } from 'pg'

import StrictTypedClient from '../src/StrictTypedClient'

export async function getDatabase () {
  const postgresUrl = process.env.PLURALKIT_DATABASE

  const pg = new Client({ connectionString: postgresUrl })
  await pg.connect()
  return pg
}

export function getTypedClient () {
  const token = process.env.PLURALKIT_TOKEN
  const baseURL = process.env.PLURALKIT_BASEURL

  return new StrictTypedClient(token, baseURL)
}
