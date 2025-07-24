import { expect, test, describe, beforeEach } from 'vitest'

import { getDatabase, getTypedClient } from '../util.ts'

import { SystemRef } from '../../src/models/SystemID.ts'
import { createSystem, createSystemWithToken } from '../queries.ts'
import { GuildSnowflake } from '../../src/models/DiscordSnowflake.ts'

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

    const client = getTypedClient(true)
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

  test('getSystemSettings', async () => {
    const db = await getDatabase()
    const client = getTypedClient()

    await createSystem(db, 'exmpl', 'test system')
    const settings = await client.getSystemSettings(SystemRef.parse('exmpl'))

    expect(settings.hidListPadding).toBe('off')
  })

  test('getOwnSystemSettings', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    await createSystemWithToken(db, 'exmpl', 'test system')
    const settings = await client.getOwnSystemSettings()

    expect(settings.hidListPadding).toBe('off')
  })

  test('getOwnSystemAutoproxySettings', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    await createSystemWithToken(db, 'exmpl', 'test system')
    const settings = await client.getOwnSystemAutoproxySettings(GuildSnowflake.parse('1'))

    expect(settings.autoproxyMode).toBe('off')
  })

  test('getOwnSystemGuildSettings', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    await createSystemWithToken(db, 'exmpl', 'test system')
    const settings = await client.getOwnSystemGuildSettings(GuildSnowflake.parse('1'))

    expect(settings.proxyingEnabled).toBe(true)
  })

  test('updateSystem', async () => {
    const db = await getDatabase()
    await createSystemWithToken(db, 'exmpl', 'old name')

    const client = getTypedClient(true)
    const system = await client.updateSystem(SystemRef.parse('exmpl'), {
      name: 'new name',
    })
    expect(system.name).toBe('new name')
  })

  test('updateSystemSettings', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    await createSystemWithToken(db, 'exmpl', 'old name')

    expect(await client.updateSystemSettings(SystemRef.parse('@me'), {
      caseSensitiveProxyTags: true
    })).toMatchObject({ caseSensitiveProxyTags: true })
  })

  test('updateOwnSystemGuildSettings', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    await createSystemWithToken(db, 'exmpl', 'old name')

    expect(await client.updateOwnSystemGuildSettings(GuildSnowflake.parse('1'), {
      tag: 'newtag',
    })).toMatchObject({ tag: 'newtag' })
  })

  test('updateOwnSystemAutoproxySettings', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('getMember', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('getSystemMembers', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('getMemberGroups', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('getMemberGuildSettings', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('createMember', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('updateMember', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('deleteMember', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('addMemberToGroups', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('removeMemberFromGroups', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('overwriteMemberGroups', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('updateMemberGuildSettings', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('getGroup', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('getGroups', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('getGroupMembers', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('createGroup', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('updateGroup', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('deleteGroup', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('addMembersToGroup', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('removeMembersFromGroup', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('overwriteGroupMembers', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('getSwitches', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('getSwitch', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('getFronters', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('createSwitch', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('updateSwitch', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('updateSwitchMembers', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('deleteSwitch', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })

  test('getProxiedMessageInformation', async () => {
    const db = await getDatabase()
    const client = getTypedClient()
  })
})
