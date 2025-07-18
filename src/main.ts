import { Schema } from 'effect'
import { UUID } from 'effect/Schema'
import { formatIso, DateTime } from 'effect/DateTime'

import System from './models/System.ts'
import Member from './models/Member.ts'
import Group from './models/Group.ts'
import SystemSettings from './models/SystemSettings.ts'
import PublicSystemSettings from './models/PublicSystemSettings.ts'
import DiscordSnowflake from './models/DiscordSnowflake.ts'
import SystemGuildSettings from './models/SystemGuildSettings.ts'
import SystemID from './models/SystemID.ts'
import AutoproxySettings from './models/AutoproxySettings.ts'
import MemberID from './models/MemberID.ts'
import GroupID from './models/GroupID.ts'
import MemberGuildSettings from './models/MemberGuildSettings.ts'
import Switch from './models/Switch.ts'
import Message from './models/Message.ts'

export default class PluralKit {
  constructor (protected token: string | null = null) {}

  public async setToken (token: string | null = null) {
    this.token = token
  }

  async getSystem (id: SystemID): Promise<System> {
    // TODO: SystemRef instead of SystemID
    return this.requestParsed(`https://api.pluralkit.me/v2/systems/${id}`, {}, 'GET', System)
  }

  async getSystemSettings (id: SystemID): Promise<PublicSystemSettings> {
    // TODO: SystemRef instead of SystemID
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${id}/settings`,
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
    guildId: DiscordSnowflake,
    channelId: DiscordSnowflake
  ): Promise<AutoproxySettings> {
    // TODO: Branded Snowflakes
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

  async getOwnSystemGuildSettings (guildId: DiscordSnowflake): Promise<SystemGuildSettings> {
    // TODO: Branded Snowflakes
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/@me/guilds/${guildId}`,
      {},
      'GET',
      SystemGuildSettings
    )
  }

  async updateSystem (
    id: SystemID,
    data: Partial<Omit<System, 'id' | 'uuid' | 'createdAt'>>
  ): Promise<System> {
    // TODO: SystemRef instead of SystemID
    // TODO: Proper type and validation for UpdateSystemRequest
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${id}`,
      {},
      'PATCH',
      System,
      data
    )
  }

  async updateSystemSettings (id: SystemID, data: Partial<SystemSettings>): Promise<SystemSettings> {
    // TODO: SystemRef instead of SystemID
    // TODO: Proper type and validation for UpdateSystemSettingsRequest
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${id}/settings`,
      {},
      'PATCH',
      SystemSettings,
      data
    )
  }

  async updateOwnSystemGuildSettings (
    guildId: DiscordSnowflake,
    data: Partial<SystemGuildSettings>
  ): Promise<SystemGuildSettings> {
    // TODO: Branded Snowflakes
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
    guildId: DiscordSnowflake,
    // NOTE: Currently unsupported, see
    //       https://pluralkit.me/api/endpoints/#update-system-autoproxy-settings
    /* channelId: DiscordSnowflake, */
    data: Partial<AutoproxySettings>
  ): Promise<AutoproxySettings> {
    // TODO: Branded Snowflakes
    // TODO: Proper type and validation for UpdateSystemAutoproxySettingsRequest

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/@me/guilds/${guildId}`,
      {},
      'PATCH',
      AutoproxySettings,
      data
    )
  }

  async getMember (id: MemberID): Promise<Member> {
    // TODO: MemberRef instead of MemberID
    return this.requestParsed(`https://api.pluralkit.me/v2/members/${id}`, {}, 'GET', Member)
  }

  // TODO: Return type, also document in PluralKit docs
  async getMemberGroups (id: MemberID): Promise<unknown> {
    // TODO: MemberRef instead of MemberID
    return this.requestParsed(`https://api.pluralkit.me/v2/members/${id}/groups`, {}, 'GET', Member)
  }

  async getMemberGuildSettings (
    id: MemberID,
    guildId: DiscordSnowflake
  ): Promise<MemberGuildSettings> {
    // TODO: MemberRef instead of MemberID
    // TODO: Branded Snowflakes
    return this.requestParsed(
      `https://api.pluralkit.me/v2/members/${id}/guilds/${guildId}`,
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
    id: MemberID,
    member: Partial<Omit<Member, 'id' | 'uuid' | 'createdAt' | 'lastMessageAt'>>
  ): Promise<Member> {
    // TODO: MemberRef instead of MemberID
    // TODO: Proper type and validation for UpdateMemberRequest
    return this.requestParsed(
      `https://api.pluralkit.me/v2/members/${id}`,
      {},
      'PATCH',
      Member,
      member
    )
  }

  async deleteMember (id: MemberID): Promise<void> {
    // TODO: MemberRef instead of MemberID
    const resp = await this.request(`https://api.pluralkit.me/v2/members/${id}`, {}, 'DELETE')

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error deleting member ${id}`)
    }
  }

  async addMemberToGroups (memberId: MemberID, groupIds: Array<GroupID>): Promise<void> {
    // TODO: MemberRef instead of MemberID
    // TODO: GroupRef instead of GroupID
    // TODO: Proper type and validation for AddMemberToGroupsRequest
    const resp = await this.request(
      `https://api.pluralkit.me/v2/members/${memberId}/groups/add`,
      {},
      'POST',
      groupIds
    )

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error adding member ${memberId} to groups ${groupIds.join(', ')}`)
    }
  }

  async removeMemberFromGroups (memberId: MemberID, groupIds: Array<GroupID>): Promise<void> {
    // TODO: MemberRef instead of MemberID
    // TODO: GroupRef instead of GroupID
    // TODO: Proper type and validation for RemoveMemberFromGroupsRequest
    const resp = await this.request(
      `https://api.pluralkit.me/v2/members/${memberId}/groups/remove`,
      {},
      'POST',
      groupIds
    )

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error removing member ${memberId} from groups ${groupIds.join(', ')}`)
    }
  }

  async overwriteMemberGroups (memberId: MemberID, groupIds: Array<GroupID>): Promise<void> {
    // TODO: MemberRef instead of MemberID
    // TODO: GroupRef instead of GroupID
    // TODO: Proper type and validation for OverwriteMemberGroupsRequest
    const resp = await this.request(
      `https://api.pluralkit.me/v2/members/${memberId}/groups/overwrite`,
      {},
      'POST',
      groupIds
    )

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error overwriting groups for member ${memberId} with ${groupIds.join(', ')}`)
    }
  }

  async updateMemberGuildSettings (
    memberId: MemberID,
    guildId: DiscordSnowflake,
    settings: Partial<MemberGuildSettings>
  ): Promise<MemberGuildSettings> {
    // TODO: MemberRef instead of MemberID
    // TODO: Branded Snowflakes
    // TODO: Proper type and validation for UpdateMemberGuildSettingsRequest
    return this.requestParsed(
      `https://api.pluralkit.me/v2/members/${memberId}/guilds/${guildId}`,
      {},
      'PATCH',
      MemberGuildSettings,
      settings
    )
  }

  async getGroup (id: GroupID): Promise<Group> {
    // TODO: GroupRef instead of GroupID
    return this.requestParsed(`https://api.pluralkit.me/v2/groups/${id}`, {}, 'GET', Group)
  }

  async getGroupMembers (id: GroupID) {
    // TODO: GroupRef instead of GroupID
    return this.requestParsed(
      `https://api.pluralkit.me/v2/groups/${id}/members`,
      {},
      'GET',
      Schema.Array(Group)
    )
  }

  async createGroup (
    group: Partial<Omit<Group, 'id' | 'uuid' | 'name' | 'createdAt'>> & Pick<Group, 'name'>
  ): Promise<Group> {
    // TODO: Proper type and validation for CreateGroupRequest
    return this.requestParsed('https://api.pluralkit.me/v2/groups', {}, 'POST', Group, group)
  }

  async updateGroup (
    id: GroupID,
    data: Partial<Omit<Group, 'id' | 'uuid' | 'createdAt'>>
  ): Promise<Group> {
    // TODO: GroupRef instead of GroupID
    // TODO: Proper type and validation for UpdateGroupRequest
    // TODO: Error object on failure
    return this.requestParsed(`https://api.pluralkit.me/v2/groups/${id}`, {}, 'PATCH', Group, data)
  }

  async deleteGroup (id: GroupID): Promise<void> {
    // TODO: GroupRef instead of GroupID
    const resp = await this.request(`https://api.pluralkit.me/v2/groups/${id}`, {}, 'DELETE')

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error deleting group ${id}`)
    }
  }

  async addMembersToGroup (id: GroupID, members: Array<MemberID>): Promise<void> {
    // TODO: GroupRef instead of GroupID
    // TODO: MemberRef instead of MemberID
    const resp = await this.request(
      `https://api.pluralkit.me/v2/groups/${id}/add`,
      {},
      'POST',
      members
    )

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error deleting group ${id}`)
    }
  }

  async removeMembersFromGroup (id: GroupID, members: Array<MemberID>): Promise<void> {
    // TODO: GroupRef instead of GroupID
    // TODO: MemberRef instead of MemberID
    const resp = await this.request(
      `https://api.pluralkit.me/v2/groups/${id}/remove`,
      {},
      'POST',
      members
    )

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error deleting group ${id}`)
    }
  }

  async overwriteGroupMembers (id: GroupID, members: Array<MemberID>): Promise<void> {
    // TODO: GroupRef instead of GroupID
    // TODO: MemberRef instead of MemberID
    const resp = await this.request(
      `https://api.pluralkit.me/v2/groups/${id}/overwrite`,
      {},
      'POST',
      members
    )

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error overwriting members for group ${id} with ${members.join(', ')}`)
    }
  }

  async getSwitches (id: SystemID, limit = 100, before?: DateTime) {
    // TODO: SystemRef instead of SystemID
    const params: Record<string, string> = {
      limit: limit.toString()
    }
    if (before) {
      params.before = formatIso(before)
    }

    // TODO: Narrowed type for method (members = Array<MemberID>)
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${id}/switches`,
      params,
      'GET',
      Schema.Array(Switch)
    )
  }

  async getSwitch (systemId: SystemID, switchId: UUID): Promise<Switch> {
    // TODO: SystemRef instead of SystemID
    // TODO: SwitchRef instead of UUID
    // TODO: Narrowed type for method (members = Array<Member>)
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemId}/switches/${switchId}`,
      {},
      'GET',
      Switch
    )
  }

  async getFronters (systemId: SystemID) {
    // TODO: SystemRef instead of SystemID
    // TODO: Narrowed type for method (members = Array<Member>)
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemId}/fronters`,
      {},
      'GET',
      Switch
    )
  }

  async createSwitch (systemId: SystemID, members: Array<MemberID | UUID>, timestamp?: DateTime) {
    // TODO: SystemRef instead of SystemID
    // TODO: SwitchRef instead of UUID
    // TODO: Return type, also document in PluralKit docs
    // TODO: Proper type and validation for CreateSwitchRequest

    const data: Record<string, unknown> = {
      members
    }
    if (timestamp) {
      data.timestamp = formatIso(timestamp)
    }

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemId}/switches`,
      {},
      'POST',
      Switch,
      data
    )
  }

  async updateSwitch (systemId: SystemID, switchId: UUID, timestamp: DateTime): Promise<Switch> {
    // TODO: SystemRef instead of SystemID
    // TODO: SwitchRef instead of UUID
    // TODO: Narrowed type for method (members = Array<Member>)
    // TODO: Proper type and validation for UpdateSwitchRequest

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemId}/switches/${switchId}`,
      {},
      'PATCH',
      Switch,
      { timestamp: formatIso(timestamp) }
    )
  }

  async updateSwitchMembers (
    systemId: SystemID,
    switchId: UUID,
    members: Array<MemberID | UUID>
  ): Promise<Switch> {
    // TODO: SystemRef instead of SystemID
    // TODO: SwitchRef instead of UUID
    // TODO: Narrowed type for method (members = Array<Member>)
    // TODO: Proper type and validation for UpdateSwitchMembersRequest

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemId}/switches/${switchId}/members`,
      {},
      'PATCH',
      Switch,
      { members }
    )
  }

  async deleteSwitch (systemId: SystemID, switchId: UUID) {
    // TODO: SwitchRef instead of UUID
    // TODO: SystemRef instead of SystemID
    const resp = await this.request(
      `https://api.pluralkit.me/v2/systems/${systemId}/switches/${switchId}`,
      {},
      'DELETE'
    )

    if (resp.status !== 204) {
      // TODO: Better error type
      throw Error(`error deleting switch ${switchId} for system ${systemId}`)
    }
  }

  async getProxiedMessageInformation (messageId: DiscordSnowflake): Promise<Message> {
    // TODO: Branded Snowflakes
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

    return fetch(url + params.size ? `?${params.toString()}` : '', options)
  }

  async requestParsed<A, I, T>(
    url: string,
    parameters: Record<string, string> = {},
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    schema: Schema.Schema<A, I>,
    data?: T
  ): Promise<A> {
    const resp = await this.request(url, parameters, method, data)
    return Schema.decodeUnknownSync(schema)(await resp.json())
  }
}
