import z, { ZodType } from 'zod'
import { objectToCamel } from 'ts-case-convert'

import { APIError, HTTPError, AuthorizationRequired } from './errors.ts'

import System, { SystemFromApi } from './models/System.ts'
import Member, { MemberFromApi, MemberToApi } from './models/Member.ts'
import Group from './models/Group.ts'
import SystemSettings from './models/SystemSettings.ts'
import PublicSystemSettings from './models/PublicSystemSettings.ts'
import { GuildSnowflake, MessageSnowflake } from './models/DiscordSnowflake.ts'
import SystemGuildSettings from './models/SystemGuildSettings.ts'
import { SystemRef } from './models/SystemID.ts'
import AutoproxySettings, { AutoproxySettingsFromApi } from './models/AutoproxySettings.ts'
import { MemberRef } from './models/MemberID.ts'
import { GroupRef } from './models/GroupID.ts'
import MemberGuildSettings from './models/MemberGuildSettings.ts'
import {
  SwitchWithMemberIDs,
  SwitchWithMemberIDsFromApi,
  SwitchWithMembers,
  SwitchWithMembersFromApi
} from './models/Switch.ts'
import Message, { MessageFromApi } from './models/Message.ts'
import { SwitchID } from './models/SwitchID.ts'

export interface Options {
  token?: string | null
}

export default class StrictTypedClient {
  constructor (protected token: string | null = null) {}

  public async setToken (token: string | null = null) {
    this.token = token
  }

  protected checkToken () {
    if (!this.token) {
      throw new AuthorizationRequired()
    }
  }

  async getSystem (systemRef: SystemRef, options: Options = {}): Promise<System> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}`,
      {},
      'GET',
      SystemFromApi,
      undefined,
      options
    )
  }

  async getSystemSettings (
    systemRef: SystemRef,
    options: Options = {}
  ): Promise<PublicSystemSettings> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/settings`,
      {},
      'GET',
      PublicSystemSettings,
      undefined,
      options
    )
  }

  async getOwnSystemSettings (options: Options = {}): Promise<SystemSettings> {
    this.checkToken()

    return this.requestParsed(
      'https://api.pluralkit.me/v2/systems/@me/settings',
      {},
      'GET',
      SystemSettings,
      undefined,
      options
    )
  }

  async getOwnSystemAutoproxySettings (
    // NOTE: Currently unsupported, see
    //       https://pluralkit.me/api/endpoints/#update-system-autoproxy-settings
    guildId: GuildSnowflake,
    // NOTE: Currently unsupported, see
    //       https://pluralkit.me/api/endpoints/#update-system-autoproxy-settings
    /* channelId: ChannelSnowflake, */
    options: Options = {}
  ): Promise<AutoproxySettings> {
    this.checkToken()

    return this.requestParsed(
      'https://api.pluralkit.me/v2/systems/@me/autoproxy',
      { guild_id: guildId },
      'GET',
      AutoproxySettingsFromApi,
      undefined,
      options
    )
  }

  async getOwnSystemGuildSettings (
    guildId: GuildSnowflake,
    options: Options = {}
  ): Promise<SystemGuildSettings> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/@me/guilds/${guildId}`,
      {},
      'GET',
      SystemGuildSettings,
      undefined,
      options
    )
  }

  async updateSystem (
    systemRef: SystemRef,
    data: Partial<System>,
    options: Options = {}
  ): Promise<System> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}`,
      {},
      'PATCH',
      SystemFromApi,
      System.partial().parse(data),
      options
    )
  }

  async updateSystemSettings (
    systemRef: SystemRef,
    data: Partial<SystemSettings>,
    options: Options = {}
  ): Promise<SystemSettings> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/settings`,
      {},
      'PATCH',
      SystemSettings,
      SystemSettings.partial().parse(data),
      options
    )
  }

  async updateOwnSystemGuildSettings (
    guildId: GuildSnowflake,
    data: Partial<SystemGuildSettings>,
    options: Options = {}
  ): Promise<SystemGuildSettings> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/@me/guilds/${guildId}`,
      {},
      'PATCH',
      SystemGuildSettings,
      SystemGuildSettings.partial().parse(data),
      options
    )
  }

  async updateOwnSystemAutoproxySettings (
    guildId: GuildSnowflake,
    // NOTE: Currently unsupported, see
    //       https://pluralkit.me/api/endpoints/#update-system-autoproxy-settings
    /* channelId: ChannelSnowflake, */
    data: Partial<AutoproxySettings>,
    options: Options = {}
  ): Promise<AutoproxySettings> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/@me/guilds/${guildId}`,
      {},
      'PATCH',
      AutoproxySettingsFromApi,
      AutoproxySettings.partial().parse(data),
      options
    )
  }

  async getMember (memberRef: MemberRef, options: Options = {}): Promise<Member> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/members/${memberRef}`,
      {},
      'GET',
      MemberFromApi,
      undefined,
      options
    )
  }

  async getSystemMembers (systemRef: SystemRef, options: Options = {}): Promise<Array<Member>> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/members`,
      {},
      'GET',
      z.array(MemberFromApi),
      undefined,
      options
    )
  }

  async getMemberGroups (memberRef: MemberRef, options: Options = {}): Promise<Array<Group>> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/members/${memberRef}/groups`,
      {},
      'GET',
      z.array(Group),
      undefined,
      options
    )
  }

  async getMemberGuildSettings (
    memberRef: MemberRef,
    guildId: GuildSnowflake,
    options: Options = {}
  ): Promise<MemberGuildSettings> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/members/${memberRef}/guilds/${guildId}`,
      {},
      'GET',
      MemberGuildSettings,
      undefined,
      options
    )
  }

  async createMember (
    member: Partial<Member> & Pick<Member, 'name'>,
    options: Options = {}
  ): Promise<Member> {
    this.checkToken()

    return this.requestParsed(
      'https://api.pluralkit.me/v2/members',
      {},
      'POST',
      MemberFromApi,
      MemberToApi.partial().required({ name: true }).parse(member),
      options
    )
  }

  async updateMember (
    memberRef: MemberRef,
    member: Partial<Member>,
    options: Options = {}
  ): Promise<Member> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/members/${memberRef}`,
      {},
      'PATCH',
      MemberFromApi,
      MemberToApi.partial().required({ name: true }).parse(member),
      options
    )
  }

  async deleteMember (memberRef: MemberRef, options: Options = {}): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/members/${memberRef}`,
      {},
      'DELETE',
      undefined,
      options
    )

    if (resp.status !== 204) {
      throw Error(`error deleting member ${memberRef}`, {
        cause: await HTTPError.fromResponse(resp)
      })
    }
  }

  async addMemberToGroups (
    memberRef: MemberRef,
    groupRefs: Array<GroupRef>,
    options: Options = {}
  ): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/members/${memberRef}/groups/add`,
      {},
      'POST',
      groupRefs,
      options
    )
    if (resp.status !== 204) {
      throw Error(`error adding member ${memberRef} to groups ${groupRefs.join(', ')}`, {
        cause: await HTTPError.fromResponse(resp)
      })
    }
  }

  async removeMemberFromGroups (
    memberRef: MemberRef,
    groupRefs: Array<GroupRef>,
    options: Options = {}
  ): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/members/${memberRef}/groups/remove`,
      {},
      'POST',
      groupRefs,
      options
    )

    if (resp.status !== 204) {
      throw Error(`error removing member ${memberRef} from groups ${groupRefs.join(', ')}`, {
        cause: await HTTPError.fromResponse(resp)
      })
    }
  }

  async overwriteMemberGroups (
    memberRef: MemberRef,
    groupRefs: Array<GroupRef>,
    options: Options = {}
  ): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/members/${memberRef}/groups/overwrite`,
      {},
      'POST',
      groupRefs,
      options
    )

    if (resp.status !== 204) {
      throw Error(`error overwriting groups for member ${memberRef} with ${groupRefs.join(', ')}`, {
        cause: await HTTPError.fromResponse(resp)
      })
    }
  }

  async updateMemberGuildSettings (
    memberRef: MemberRef,
    guildId: GuildSnowflake,
    settings: Partial<MemberGuildSettings>,
    options: Options = {}
  ): Promise<MemberGuildSettings> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/members/${memberRef}/guilds/${guildId}`,
      {},
      'PATCH',
      MemberGuildSettings,
      MemberGuildSettings.partial().parse(settings),
      options
    )
  }

  async getGroup (groupRef: GroupRef, options: Options = {}): Promise<Group> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/groups/${groupRef}`,
      {},
      'GET',
      Group,
      undefined,
      options
    )
  }

  async getGroups (systemRef: SystemRef, options: Options = {}): Promise<Array<Group>> {
    return this.requestParsed(
     `https://api.pluralkit.me/v2/systems/${systemRef}/groups`,
     {},
     'GET',
     z.array(Group),
     undefined,
     options
    )
  }

  async getGroupMembers (groupRef: GroupRef, options: Options = {}): Promise<Array<Member>> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/groups/${groupRef}/members`,
      {},
      'GET',
      z.array(Member),
      undefined,
      options
    )
  }

  async createGroup (
    group: Partial<Group> & Pick<Group, 'name'>,
    options: Options = {}
  ): Promise<Group> {
    this.checkToken()

    return this.requestParsed(
      'https://api.pluralkit.me/v2/groups',
      {},
      'POST',
      Group,
      Group.partial().required({ name: true }).parse(group),
      options
    )
  }

  async updateGroup (
    groupRef: GroupRef,
    data: Partial<Group>,
    options: Options = {}
  ): Promise<Group> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/groups/${groupRef}`,
      {},
      'PATCH',
      Group,
      Group.partial().parse(data),
      options
    )
  }

  async deleteGroup (groupRef: GroupRef, options: Options = {}): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/groups/${groupRef}`,
      {},
      'DELETE',
      undefined,
      options
    )

    if (resp.status !== 204) {
      throw Error(`error deleting group ${groupRef}`, {
        cause: await HTTPError.fromResponse(resp)
      })
    }
  }

  async addMembersToGroup (
    groupRef: GroupRef,
    memberRefs: Array<MemberRef>,
    options: Options = {}
  ): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/groups/${groupRef}/add`,
      {},
      'POST',
      memberRefs,
      options
    )

    if (resp.status !== 204) {
      throw Error(`error deleting group ${groupRef}`, {
        cause: await HTTPError.fromResponse(resp)
      })
    }
  }

  async removeMembersFromGroup (
    groupRef: GroupRef,
    memberRefs: Array<MemberRef>,
    options: Options = {}
  ): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/groups/${groupRef}/remove`,
      {},
      'POST',
      memberRefs,
      options
    )

    if (resp.status !== 204) {
      throw Error(`error deleting group ${groupRef}`, {
        cause: await HTTPError.fromResponse(resp)
      })
    }
  }

  async overwriteGroupMembers (
    groupRef: GroupRef,
    memberRefs: Array<MemberRef>,
    options: Options = {}
  ): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/groups/${groupRef}/overwrite`,
      {},
      'POST',
      memberRefs,
      options
    )

    if (resp.status !== 204) {
      throw Error(`error overwriting members for group ${groupRef} with ${memberRefs.join(', ')}`, {
        cause: await HTTPError.fromResponse(resp)
      })
    }
  }

  async getSwitches (
    systemRef: SystemRef,
    limit = 100,
    before?: Date,
    options: Options = {}
  ): Promise<Array<SwitchWithMemberIDs>> {
    const params: Record<string, string> = {
      limit: limit.toString()
    }
    if (before) {
      params.before = before.toISOString()
    }

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/switches`,
      params,
      'GET',
      z.array(SwitchWithMemberIDsFromApi),
      undefined,
      options
    )
  }

  async getSwitch (
    systemRef: SystemRef,
    switchId: SwitchID,
    options: Options = {}
  ): Promise<SwitchWithMembers> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/switches/${switchId}`,
      {},
      'GET',
      SwitchWithMembersFromApi,
      undefined,
      options
    )
  }

  async getFronters (systemRef: SystemRef, options: Options = {}): Promise<SwitchWithMembers> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/fronters`,
      {},
      'GET',
      SwitchWithMembersFromApi,
      undefined,
      options
    )
  }

  async createSwitch (
    systemRef: SystemRef,
    memberRefs: Array<MemberRef>,
    timestamp?: Date,
    options: Options = {}
  ): Promise<SwitchWithMembers> {
    this.checkToken()

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
      SwitchWithMembersFromApi,
      data,
      options
    )
  }

  async updateSwitch (
    systemRef: SystemRef,
    switchId: SwitchID,
    timestamp: Date,
    options: Options = {}
  ): Promise<SwitchWithMembers> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/switches/${switchId}`,
      {},
      'PATCH',
      SwitchWithMembersFromApi,
      { timestamp: timestamp.toISOString() },
      options
    )
  }

  async updateSwitchMembers (
    systemRef: SystemRef,
    switchId: SwitchID,
    memberRefs: Array<MemberRef>,
    options: Options = {}
  ): Promise<SwitchWithMembers> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/switches/${switchId}/members`,
      {},
      'PATCH',
      SwitchWithMembersFromApi,
      memberRefs,
      options
    )
  }

  async deleteSwitch (systemRef: SystemRef, switchId: SwitchID, options: Options = {}) {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/systems/${systemRef}/switches/${switchId}`,
      {},
      'DELETE',
      undefined,
      options
    )

    if (resp.status !== 204) {
      throw Error(`error deleting switch ${switchId} for system ${systemRef}`, {
        cause: await HTTPError.fromResponse(resp)
      })
    }
  }

  async getProxiedMessageInformation (
    messageId: MessageSnowflake,
    options: Options = {}
  ): Promise<Message> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/messages/${messageId}`,
      {},
      'GET',
      MessageFromApi,
      undefined,
      options
    )
  }

  async request<T>(
    url: string,
    parameters: Record<string, string> = {},
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    data: T | undefined,
    options: Options
  ): Promise<Response> {
    console.log({ url, parameters, method })
    const headers = new Headers(data ? { 'Content-Type': 'application/json' } : {})
    if (this.token) {
      headers.append('Authorization', this.token ?? options.token)
    }

    const params = new URLSearchParams(parameters)
    const requestOptions: RequestInit = {
      method,
      headers
    }
    if (data) {
      requestOptions.body = JSON.stringify(data)
    }

    const resp = await fetch(url + (params.size ? `?${params.toString()}` : ''), requestOptions)
    if (resp.status < 200 || resp.status > 299) {
      const body = await resp.text()
      if (APIError.isAPIErrorStatus(resp.status)) {
        // try to parse the error from json and if it fails return a regular HTTPError
        try {
          throw APIError.fromResponse(resp, JSON.parse(body))
        } catch (e) {
          if (e instanceof APIError || !(e instanceof SyntaxError)) {
            throw e
          }
        }
      }

      throw new HTTPError(resp.status, resp.statusText, body)
    }

    return resp
  }

  async requestParsed<O, T>(
    url: string,
    parameters: Record<string, string> = {},
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    schema: ZodType<O>,
    data: T | undefined,
    options: Options
  ): Promise<O> {
    const resp = await this.request(url, parameters, method, data, options)
    const json = await resp.json()
    if (typeof json !== 'object' || json === null) {
      throw new Error(`Expected JSON object, got ${JSON.stringify(json)} instead`)
    }

    return schema.parse(objectToCamel(json))
  }
}
