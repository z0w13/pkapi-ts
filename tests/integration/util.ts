import { Client } from 'pg'

import StrictTypedClient from 'src/StrictTypedClient.js'

export async function getDatabase () {
  const postgresUrl = process.env.PLURALKIT_DATABASE

  const pg = new Client({ connectionString: postgresUrl })
  await pg.connect()
  return pg
}

export function getTypedClient (authenticated = false) {
  const token = process.env.PLURALKIT_TOKEN
  const baseURL = process.env.PLURALKIT_BASEURL

  return new StrictTypedClient(authenticated ? token : null, true, baseURL)
}
