import { expect, test, describe, beforeEach } from 'vitest'

import { getDatabase, getTypedClient } from '../util.ts'

import { SystemRef } from '../../src/models/SystemID.ts'
import { createSystem, createSystemWithToken } from '../queries.ts'

beforeEach(async () => {
  const db = await getDatabase()
  const tables = [
    'abuse_logs',
    'accounts',
    'autoproxy',
    'command_messages',
    'group_members',
    'groups',
    'info',
    'member_guild',
    'members',
    'messages',
    'servers',
    'shards',
    'switch_members',
    'switches',
    'system_config',
    'system_guild',
    'systems',
    'webhooks',
  ]

  for (const table of tables) {
    await db.query(`DELETE FROM ${table}`)
  }
})

describe('PluralKit', () => {
  test("getSystem('@me')", async () => {
    const db = await getDatabase()
    await createSystemWithToken(db, 'tstsys', 'test system')

    const client = getTypedClient()
    const system = await client.getSystem(SystemRef.parse('@me'))
    expect(system.id).toBe('tstsys')
  })

  test('getSystem', async () => {
    const db = await getDatabase()
    await createSystem(db, 'exmpl', 'test system 2')

    const client = getTypedClient()
    const system = await client.getSystem(SystemRef.parse('exmpl'))
    expect(system.id).toBe('exmpl')
  })

  test('updateSystem', async () => {
    const db = await getDatabase()
    await createSystemWithToken(db, 'exmpl', 'old name')

    const client = getTypedClient()
    const system = await client.updateSystem(SystemRef.parse('exmpl'), {
      name: 'new name',
    })
    expect(system.name).toBe('new name')
  })
})
