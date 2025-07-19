import z, { ZodType } from 'zod'
import { objectToCamel } from 'ts-case-convert'

import System from './models/System.ts'
import Member from './models/Member.ts'
import Group from './models/Group.ts'
import SystemSettings from './models/SystemSettings.ts'
import PublicSystemSettings from './models/PublicSystemSettings.ts'
import { GuildSnowflake, MessageSnowflake } from './models/DiscordSnowflake.ts'
import SystemGuildSettings from './models/SystemGuildSettings.ts'
import { SystemRef } from './models/SystemID.ts'
import AutoproxySettings from './models/AutoproxySettings.ts'
import { MemberRef } from './models/MemberID.ts'
import { GroupRef } from './models/GroupID.ts'
import MemberGuildSettings from './models/MemberGuildSettings.ts'
import Switch from './models/Switch.ts'
import Message from './models/Message.ts'
import { SwitchID } from './models/SwitchID.ts'

export default class PluralKit {
  constructor (protected token: string | null = null) {}

  public async setToken (token: string | null = null) {
    this.token = token
  }

  async getSystem (systemRef: SystemRef): Promise<System> {
    return this.requestParsed(`https://api.pluralkit.me/v2/systems/${systemRef}`, {}, 'GET', System)
  }

  async getSystemSettings (systemRef: SystemRef): Promise<PublicSystemSettings> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/settings`,
      {},
      'GET',
      PublicSystemSettings
    )
  }

  async getOwnSystemSettings (): Promise<SystemSettings> {
    if (!this.token) {
      throw new Error('token missing')
    }

    return this.requestParsed(
      'https://api.pluralkit.me/v2/systems/@me/settings',
      {},
      'GET',
      SystemSettings
    )
  }

  async getOwnSystemAutoproxySettings (
    guildId: GuildSnowflake,
    channelId: GuildSnowflake
  ): Promise<AutoproxySettings> {
    if (!this.token) {
      throw new Error('token missing')
    }

    return this.requestParsed(
      'https://api.pluralkit.me/v2/systems/@me/autoproxy',
      { guild_id: guildId, channel_id: channelId },
      'GET',
      AutoproxySettings
    )
  }

  async getOwnSystemGuildSettings (guildId: GuildSnowflake): Promise<SystemGuildSettings> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/@me/guilds/${guildId}`,
      {},
      'GET',
      SystemGuildSettings
    )
  }

  async updateSystem (
    systemRef: SystemRef,
    data: Partial<Omit<System, 'id' | 'uuid' | 'createdAt'>>
  ): Promise<System> {
    // TODO: Proper type and validation for UpdateSystemRequest
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}`,
      {},
      'PATCH',
      System,
      data
    )
  }

  async updateSystemSettings (
    systemRef: SystemRef,
    data: Partial<SystemSettings>
  ): Promise<SystemSettings> {
    // TODO: Proper type and validation for UpdateSystemSettingsRequest
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/settings`,
      {},
      'PATCH',
      SystemSettings,
      data
    )
  }

  async updateOwnSystemGuildSettings (
    guildId: GuildSnowflake,
    data: Partial<SystemGuildSettings>
  ): Promise<SystemGuildSettings> {
    // TODO: Proper type and validation for UpdateSystemGuildSettingsRequest
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/@me/guilds/${guildId}`,
      {},
      'PATCH',
      SystemGuildSettings,
      data
    )
  }

  async updateOwnSystemAutoproxySettings (
    guildId: GuildSnowflake,
    // NOTE: Currently unsupported, see
    //       https://pluralkit.me/api/endpoints/#update-system-autoproxy-settings
    /* channelId: ChannelSnowflake, */
    data: Partial<AutoproxySettings>
  ): Promise<AutoproxySettings> {
    // TODO: Proper type and validation for UpdateSystemAutoproxySettingsRequest

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/@me/guilds/${guildId}`,
      {},
      'PATCH',
      AutoproxySettings,
      data
    )
  }

  async getMember (memberRef: MemberRef): Promise<Member> {
    return this.requestParsed(`https://api.pluralkit.me/v2/members/${memberRef}`, {}, 'GET', Member)
  }

  // TODO: Return type, also document in PluralKit docs
  async getMemberGroups (memberRef: MemberRef): Promise<unknown> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/members/${memberRef}/groups`,
      {},
      'GET',
      Member
    )
  }

  async getMemberGuildSettings (
    memberRef: MemberRef,
    guildId: GuildSnowflake
  ): Promise<MemberGuildSettings> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/members/${memberRef}/guilds/${guildId}`,
      {},
      'GET',
      MemberGuildSettings
    )
  }

  async createMember (
    member: Partial<Omit<Member, 'id' | 'uuid' | 'createdAt' | 'lastMessageAt'>>
  ): Promise<Member> {
    // TODO: Proper type and validation for CreateMemberRequest
    return this.requestParsed('https://api.pluralkit.me/v2/members', {}, 'POST', Member, member)
  }

  async updateMember (
    memberRef: MemberRef,
    member: Partial<Omit<Member, 'id' | 'uuid' | 'createdAt' | 'lastMessageAt'>>
  ): Promise<Member> {
    // TODO: Proper type and validation for UpdateMemberRequest
    return this.requestParsed(
      `https://api.pluralkit.me/v2/members/${memberRef}`,
      {},
      'PATCH',
      Member,
      member
    )
  }

  async deleteMember (memberRef: MemberRef): Promise<void> {
    const resp = await this.request(
      `https://api.pluralkit.me/v2/members/${memberRef}`,
      {},
      'DELETE'
    )

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error deleting member ${memberRef}`)
    }
  }

  async addMemberToGroups (memberRef: MemberRef, groupRefs: Array<GroupRef>): Promise<void> {
    // TODO: Proper type and validation for AddMemberToGroupsRequest
    const resp = await this.request(
      `https://api.pluralkit.me/v2/members/${memberRef}/groups/add`,
      {},
      'POST',
      groupRefs
    )

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error adding member ${memberRef} to groups ${groupRefs.join(', ')}`)
    }
  }

  async removeMemberFromGroups (memberRef: MemberRef, groupRefs: Array<GroupRef>): Promise<void> {
    // TODO: Proper type and validation for RemoveMemberFromGroupsRequest
    const resp = await this.request(
      `https://api.pluralkit.me/v2/members/${memberRef}/groups/remove`,
      {},
      'POST',
      groupRefs
    )

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error removing member ${memberRef} from groups ${groupRefs.join(', ')}`)
    }
  }

  async overwriteMemberGroups (memberRef: MemberRef, groupRefs: Array<GroupRef>): Promise<void> {
    // TODO: Proper type and validation for OverwriteMemberGroupsRequest
    const resp = await this.request(
      `https://api.pluralkit.me/v2/members/${memberRef}/groups/overwrite`,
      {},
      'POST',
      groupRefs
    )

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error overwriting groups for member ${memberRef} with ${groupRefs.join(', ')}`)
    }
  }

  async updateMemberGuildSettings (
    memberRef: MemberRef,
    guildId: GuildSnowflake,
    settings: Partial<MemberGuildSettings>
  ): Promise<MemberGuildSettings> {
    // TODO: Proper type and validation for UpdateMemberGuildSettingsRequest
    return this.requestParsed(
      `https://api.pluralkit.me/v2/members/${memberRef}/guilds/${guildId}`,
      {},
      'PATCH',
      MemberGuildSettings,
      settings
    )
  }

  async getGroup (groupRef: GroupRef): Promise<Group> {
    return this.requestParsed(`https://api.pluralkit.me/v2/groups/${groupRef}`, {}, 'GET', Group)
  }

  async getGroupMembers (groupRef: GroupRef) {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/groups/${groupRef}/members`,
      {},
      'GET',
      z.array(Group)
    )
  }

  async createGroup (
    group: Partial<Omit<Group, 'id' | 'uuid' | 'name' | 'createdAt'>> & Pick<Group, 'name'>
  ): Promise<Group> {
    // TODO: Proper type and validation for CreateGroupRequest
    return this.requestParsed('https://api.pluralkit.me/v2/groups', {}, 'POST', Group, group)
  }

  async updateGroup (
    groupRef: GroupRef,
    data: Partial<Omit<Group, 'id' | 'uuid' | 'createdAt'>>
  ): Promise<Group> {
    // TODO: Proper type and validation for UpdateGroupRequest
    // TODO: Error object on failure
    return this.requestParsed(
      `https://api.pluralkit.me/v2/groups/${groupRef}`,
      {},
      'PATCH',
      Group,
      data
    )
  }

  async deleteGroup (groupRef: GroupRef): Promise<void> {
    const resp = await this.request(`https://api.pluralkit.me/v2/groups/${groupRef}`, {}, 'DELETE')

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error deleting group ${groupRef}`)
    }
  }

  async addMembersToGroup (groupRef: GroupRef, memberRefs: Array<MemberRef>): Promise<void> {
    const resp = await this.request(
      `https://api.pluralkit.me/v2/groups/${groupRef}/add`,
      {},
      'POST',
      memberRefs
    )

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error deleting group ${groupRef}`)
    }
  }

  async removeMembersFromGroup (groupRef: GroupRef, memberRefs: Array<MemberRef>): Promise<void> {
    const resp = await this.request(
      `https://api.pluralkit.me/v2/groups/${groupRef}/remove`,
      {},
      'POST',
      memberRefs
    )

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error deleting group ${groupRef}`)
    }
  }

  async overwriteGroupMembers (groupRef: GroupRef, memberRefs: Array<MemberRef>): Promise<void> {
    const resp = await this.request(
      `https://api.pluralkit.me/v2/groups/${groupRef}/overwrite`,
      {},
      'POST',
      memberRefs
    )

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error overwriting members for group ${groupRef} with ${memberRefs.join(', ')}`)
    }
  }

  async getSwitches (systemRef: SystemRef, limit = 100, before?: Date) {
    const params: Record<string, string> = {
      limit: limit.toString()
    }
    if (before) {
      params.before = before.toISOString()
    }

    // TODO: Narrowed type for method (members = Array<MemberID>)
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/switches`,
      params,
      'GET',
      z.array(Switch)
    )
  }

  async getSwitch (systemRef: SystemRef, switchId: SwitchID): Promise<Switch> {
    // TODO: Narrowed type for method (members = Array<Member>)
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/switches/${switchId}`,
      {},
      'GET',
      Switch
    )
  }

  async getFronters (systemRef: SystemRef) {
    // TODO: Narrowed type for method (members = Array<Member>)
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/fronters`,
      {},
      'GET',
      Switch
    )
  }

  async createSwitch (systemRef: SystemRef, memberRefs: Array<MemberRef>, timestamp?: Date) {
    const data: Record<string, unknown> = {
      members: memberRefs
    }
    if (timestamp) {
      data.timestamp = timestamp.toISOString()
    }

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/switches`,
      {},
      'POST',
      Switch,
      data
    )
  }

  async updateSwitch (systemRef: SystemRef, switchId: SwitchID, timestamp: Date): Promise<Switch> {
    // TODO: Narrowed type for method (members = Array<Member>)
    // TODO: Proper type and validation for UpdateSwitchRequest

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/switches/${switchId}`,
      {},
      'PATCH',
      Switch,
      { timestamp: timestamp.toISOString() }
    )
  }

  async updateSwitchMembers (
    systemRef: SystemRef,
    switchId: SwitchID,
    memberRefs: Array<MemberRef>
  ): Promise<Switch> {
    // TODO: Narrowed type for method (members = Array<Member>)
    // TODO: Proper type and validation for UpdateSwitchMembersRequest

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/switches/${switchId}/members`,
      {},
      'PATCH',
      Switch,
      { members: memberRefs }
    )
  }

  async deleteSwitch (systemRef: SystemRef, switchId: SwitchID) {
    const resp = await this.request(
      `https://api.pluralkit.me/v2/systems/${systemRef}/switches/${switchId}`,
      {},
      'DELETE'
    )

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error deleting switch ${switchId} for system ${systemRef}`)
    }
  }

  async getProxiedMessageInformation (messageId: MessageSnowflake): Promise<Message> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/messages/${messageId}`,
      {},
      'GET',
      Message
    )
  }

  async request<T>(
    url: string,
    parameters: Record<string, string> = {},
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    data?: T
  ): Promise<Response> {
    console.log({ url, parameters, method })
    const headers = new Headers()
    if (this.token) {
      headers.append('Authorization', this.token)
    }

    const params = new URLSearchParams(parameters)
    const options: RequestInit = {
      method,
      headers
    }
    if (data) {
      options.body = JSON.stringify(data)
    }

    return fetch(url + (params.size ? `?${params.toString()}` : ''), options)
  }

  async requestParsed<O, T>(
    url: string,
    parameters: Record<string, string> = {},
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    schema: ZodType<O>,
    data?: T
  ): Promise<O> {
    const resp = await this.request(url, parameters, method, data)
    const json = await resp.json()
    if (typeof json !== 'object' || json === null) {
      throw new Error(`Expected JSON object, got ${JSON.stringify(json)} instead`)
    }

    return schema.parse(objectToCamel(json))
  }
}
