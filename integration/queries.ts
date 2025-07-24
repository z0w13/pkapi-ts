import { Client } from 'pg'

export async function createSystemWithToken (db: Client, hid: string, name: string) {
  return parseInt((await db.query({
    text: 'INSERT INTO systems (hid, name, token) VALUES ($1, $2, $3) RETURNING id',
    values: [
      hid, name, process.env.PLURALKIT_TOKEN,
    ]
  })).rows[0]['id'])
}

export async function createSystem (db: Client, hid: string, name: string) {
  return parseInt((await db.query({ text: 'INSERT INTO systems (hid, name) VALUES ($1, $2) RETURNING id', values: [hid, name] })).rows[0]['id'])
}

export async function deleteSystem (db: Client, hid: string) {
  await db.query({ text: 'DELETE FROM systems WHERE hid = $1', values: [hid] })
}
