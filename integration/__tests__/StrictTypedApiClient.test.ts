import { expect, test, describe, beforeEach } from 'vitest'

import { getDatabase, getTypedClient } from '../util.ts'

import { SystemRef } from '../../src/models/SystemID.ts'
import { addMemberToGroup, createGroup, createMember, createMemberGuildSettings, createSystem, createSystemWithToken } from '../queries.ts'
import { GuildSnowflake } from '../../src/models/DiscordSnowflake.ts'
import { MemberRef } from '../../src/models/MemberID.ts'
import { GroupRef } from '../../src/models/GroupID.ts'

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
    const client = getTypedClient(true)

    await createSystemWithToken(db, 'exmpl', 'name')

    expect(await client.updateOwnSystemAutoproxySettings(GuildSnowflake.parse('1'), {
      autoproxyMode: 'latch',
    })).toMatchObject({ autoproxyMode: 'latch' })
  })

  test('getMember', async () => {
    const db = await getDatabase()
    const client = getTypedClient()

    const systemId = await createSystem(db, 'exmpl', 'name')
    await createMember(db, systemId, 'member', 'system member')

    expect(await client.getMember(MemberRef.parse('member'))).toMatchObject({ name: 'system member' })
  })

  test('getSystemMembers', async () => {
    const db = await getDatabase()
    const client = getTypedClient()

    const systemId = await createSystem(db, 'exmpl', 'name')
    await createMember(db, systemId, 'membra', 'member A')
    await createMember(db, systemId, 'membrb', 'member B')

    expect(await client.getSystemMembers(SystemRef.parse('exmpl'))).toHaveLength(2)
  })

  test('getMemberGroups', async () => {
    const db = await getDatabase()
    const client = getTypedClient()

    const systemId = await createSystem(db, 'exmpl', 'name')
    const memberId = await createMember(db, systemId, 'member', 'system member')
    const group1Id = await createGroup(db, systemId, 'groupa', 'group A')
    const group2Id = await createGroup(db, systemId, 'groupb', 'group B')
    await addMemberToGroup(db, memberId, group1Id)
    await addMemberToGroup(db, memberId, group2Id)

    expect(await client.getMemberGroups(MemberRef.parse('member'))).toHaveLength(2)
  })

  test('getMemberGuildSettings', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    const systemId = await createSystemWithToken(db, 'exmpl', 'name')
    const memberId = await createMember(db, systemId, 'member', 'system member')
    await createMemberGuildSettings(db, memberId, 1, 'guild name')

    expect(await client.getMemberGuildSettings(MemberRef.parse('member'), GuildSnowflake.parse('1'))).toMatchObject({
      displayName: 'guild name'
    })
  })

  test('createMember', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    await createSystemWithToken(db, 'exmpl', 'name')
    expect(await client.createMember({
      name: 'system member',
    })).toMatchObject({
      name: 'system member'
    })
  })

  test('updateMember', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    const systemId = await createSystemWithToken(db, 'exmpl', 'name')
    await createMember(db, systemId, 'member', 'old name')

    expect(await client.updateMember(MemberRef.parse('member'), {
      name: 'new name',
    })).toMatchObject({
      name: 'new name'
    })
  })

  test('deleteMember', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    const systemId = await createSystemWithToken(db, 'exmpl', 'name')
    await createMember(db, systemId, 'member', 'name')

    await client.deleteMember(MemberRef.parse('member'))
  })

  test('addMemberToGroups', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    const systemId = await createSystemWithToken(db, 'exmpl', 'name')
    await createMember(db, systemId, 'member', 'name')
    await createGroup(db, systemId, 'groupa', 'group A')
    await createGroup(db, systemId, 'groupb', 'group B')

    await client.addMemberToGroups(MemberRef.parse('member'), [
      GroupRef.parse('groupa'),
      GroupRef.parse('groupb')
    ])
  })

  test('removeMemberFromGroups', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    const systemId = await createSystemWithToken(db, 'exmpl', 'name')
    const memberId = await createMember(db, systemId, 'member', 'name')
    const groupId = await createGroup(db, systemId, 'groupa', 'group A')
    await addMemberToGroup(db, memberId, groupId)

    await client.removeMemberFromGroups(MemberRef.parse('member'), [
      GroupRef.parse('groupa'),
    ])
  })

  test('overwriteMemberGroups', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    const systemId = await createSystemWithToken(db, 'exmpl', 'name')
    const memberId = await createMember(db, systemId, 'member', 'name')
    const groupId = await createGroup(db, systemId, 'groupa', 'group A')
    await createGroup(db, systemId, 'groupb', 'group B')
    await addMemberToGroup(db, memberId, groupId)

    await client.overwriteMemberGroups(MemberRef.parse('member'), [
      GroupRef.parse('groupb'),
    ])
  })

  test('updateMemberGuildSettings', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    const systemId = await createSystemWithToken(db, 'exmpl', 'name')
    const memberId = await createMember(db, systemId, 'member', 'system member')
    await createMemberGuildSettings(db, memberId, 1, 'old name')

    expect(await client.updateMemberGuildSettings(MemberRef.parse('member'), GuildSnowflake.parse('1'), {
      displayName: 'new name',
    })).toMatchObject({
      displayName: 'new name'
    })
  })

  test('getGroup', async () => {
    const db = await getDatabase()
    const client = getTypedClient()

    const systemId = await createSystem(db, 'exmpl', 'name')
    await createGroup(db, systemId, 'groupa', 'group A')

    expect(await client.getGroup(GroupRef.parse('groupa'))).toMatchObject({ name: 'group A' })
  })

  test('getGroups', async () => {
    const db = await getDatabase()
    const client = getTypedClient()

    const systemId = await createSystem(db, 'exmpl', 'name')
    await createGroup(db, systemId, 'groupa', 'group A')
    await createGroup(db, systemId, 'groupb', 'group B')

    expect(await client.getGroups(SystemRef.parse('exmpl'))).toHaveLength(2)
  })

  test('getGroupMembers', async () => {
    const db = await getDatabase()
    const client = getTypedClient()

    const systemId = await createSystem(db, 'exmpl', 'name')
    const groupId = await createGroup(db, systemId, 'groupa', 'group A')
    const member1Id = await createMember(db, systemId, 'membra', 'member A')
    const member2Id = await createMember(db, systemId, 'membrb', 'member B')
    await addMemberToGroup(db, member1Id, groupId)
    await addMemberToGroup(db, member2Id, groupId)

    expect(await client.getGroupMembers(GroupRef.parse('groupa'))).toHaveLength(2)
  })

  test('createGroup', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    await createSystemWithToken(db, 'exmpl', 'name')

    expect(await client.createGroup({ name: 'new group' })).toMatchObject({
      name: 'new group',
    })
  })

  test('updateGroup', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    const systemId = await createSystemWithToken(db, 'exmpl', 'name')
    await createGroup(db, systemId, 'groupa', 'old name')

    expect(await client.updateGroup(GroupRef.parse('groupa'), { name: 'new name' })).toMatchObject({
      name: 'new name',
    })
  })

  test('deleteGroup', async () => {
    const db = await getDatabase()
    const client = getTypedClient(true)

    const systemId = await createSystemWithToken(db, 'exmpl', 'name')
    await createGroup(db, systemId, 'groupa', 'old name')

    await client.deleteGroup(GroupRef.parse('groupa'))
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
