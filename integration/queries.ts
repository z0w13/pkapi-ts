import { Client } from 'pg'

export async function createSystemWithToken (db: Client, hid: string, name: string) {
  await db.query({
    text: 'INSERT INTO systems (hid, name, token) VALUES ($1, $2, $3)',
    values: [
      hid, name, process.env.PLURALKIT_TOKEN,
    ]
  })
}

export async function createSystem (db: Client, hid: string, name: string) {
  await db.query({ text: 'INSERT INTO systems (hid, name) VALUES ($1, $2)', values: [hid, name] })
}

export async function deleteSystem (db: Client, hid: string) {
  await db.query({ text: 'DELETE FROM systems WHERE hid = $1', values: [hid] })
}
