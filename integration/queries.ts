import { Client } from 'pg'

export async function createSystemWithToken (db: Client, hid: string, name: string) {
  const systemId = parseInt((await db.query({
    text: 'INSERT INTO systems (hid, name, token) VALUES ($1, $2, $3) RETURNING id',
    values: [
      hid, name, process.env.PLURALKIT_TOKEN,
    ]
  })).rows[0]['id'])

  // create system settings and guild settings
  await createSystemSettings(db, systemId)
  await createSystemGuilds(db, systemId, 1)

  return systemId
}

export async function createSystem (db: Client, hid: string, name: string) {
  const systemId = parseInt((await db.query({ text: 'INSERT INTO systems (hid, name) VALUES ($1, $2) RETURNING id', values: [hid, name] })).rows[0]['id'])

  // create system settings and guild settings
  await createSystemSettings(db, systemId)
  await createSystemGuilds(db, systemId, 1)

  return systemId
}

export async function createSystemSettings (db: Client, id: number) {
  await db.query({ text: 'INSERT INTO system_config (system) VALUES ($1)', values: [id] })
}

export async function createSystemGuilds (db: Client, systemId: number, guildId: number) {
  await db.query({ text: 'INSERT INTO system_guild (system, guild) VALUES ($1, $2)', values: [systemId, guildId] })
}

export async function deleteSystem (db: Client, hid: string) {
  await db.query({ text: 'DELETE FROM systems WHERE hid = $1', values: [hid] })
}

export async function createMember (db: Client, system: number, hid: string, name: string) {
  return parseInt((await db.query({ text: 'INSERT INTO members (hid, system, name) VALUES ($1, $2, $3) RETURNING id', values: [hid, system, name] })).rows[0]['id'])
}

export async function createGroup (db: Client, system: number, hid: string, name: string) {
  return parseInt((await db.query({ text: 'INSERT INTO groups (hid, system, name) VALUES ($1, $2, $3) RETURNING id', values: [hid, system, name] })).rows[0]['id'])
}

export async function addMemberToGroup (db: Client, member: number, group: number) {
  await db.query({ text: 'INSERT INTO group_members (group_id, member_id) VALUES ($1, $2)', values: [group, member] })
}

export async function createMemberGuildSettings (db: Client, member: number, guild: number, displayName: string) {
  await db.query({ text: 'INSERT INTO member_guild (member, guild, display_name) VALUES ($1, $2, $3)', values: [member, guild, displayName] })
}

export async function createSwitch (db: Client, system: number, members: Array<number>) {
  const switchId = parseInt((await db.query({ text: 'INSERT INTO switches (system) VALUES ($1) RETURNING id', values: [system] })).rows[0]['id'])
  for (const memberId of members) {
    await db.query({ text: 'INSERT INTO switch_members (switch, member) VALUES ($1, $2)', values: [switchId, memberId] })
  }
  return switchId
}

export async function getSwitchUuid (db: Client, switchId: number) {
  return (await db.query({ text: 'SELECT uuid FROM switches WHERE id = $1', values: [switchId] })).rows[0]['uuid']
}

export async function createMessageInformation (db: Client, messageId: string, originalMessageId: string, channelId: string, senderId: string, memberId: number) {
  await db.query({ text: 'INSERT INTO messages (mid, original_mid, channel, sender, member) VALUES ($1, $2, $3, $4, $5)', values: [messageId, originalMessageId, channelId, senderId, memberId] })
}
