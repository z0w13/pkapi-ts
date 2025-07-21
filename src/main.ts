import z, { ZodType } from 'zod'
import { objectToCamel } from 'ts-case-convert'

import { APIError, HTTPError, AuthorizationRequired } from './errors.ts'

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

  protected checkToken () {
    if (!this.token) {
      throw new AuthorizationRequired()
    }
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
    this.checkToken()

    return this.requestParsed(
      'https://api.pluralkit.me/v2/systems/@me/settings',
      {},
      'GET',
      SystemSettings
    )
  }

  async getOwnSystemAutoproxySettings (
    // NOTE: Currently unsupported, see
    //       https://pluralkit.me/api/endpoints/#update-system-autoproxy-settings
    guildId: GuildSnowflake
    // NOTE: Currently unsupported, see
    //       https://pluralkit.me/api/endpoints/#update-system-autoproxy-settings
    /* channelId: ChannelSnowflake, */
  ): Promise<AutoproxySettings> {
    this.checkToken()

    return this.requestParsed(
      'https://api.pluralkit.me/v2/systems/@me/autoproxy',
      { guild_id: guildId },
      'GET',
      AutoproxySettings
    )
  }

  async getOwnSystemGuildSettings (guildId: GuildSnowflake): Promise<SystemGuildSettings> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/@me/guilds/${guildId}`,
      {},
      'GET',
      SystemGuildSettings
    )
  }

  async updateSystem (systemRef: SystemRef, data: Partial<System>): Promise<System> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}`,
      {},
      'PATCH',
      System,
      System.partial().parse(data)
    )
  }

  async updateSystemSettings (
    systemRef: SystemRef,
    data: Partial<SystemSettings>
  ): Promise<SystemSettings> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/settings`,
      {},
      'PATCH',
      SystemSettings,
      SystemSettings.partial().parse(data)
    )
  }

  async updateOwnSystemGuildSettings (
    guildId: GuildSnowflake,
    data: Partial<SystemGuildSettings>
  ): Promise<SystemGuildSettings> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/@me/guilds/${guildId}`,
      {},
      'PATCH',
      SystemGuildSettings,
      SystemGuildSettings.partial().parse(data)
    )
  }

  async updateOwnSystemAutoproxySettings (
    guildId: GuildSnowflake,
    // NOTE: Currently unsupported, see
    //       https://pluralkit.me/api/endpoints/#update-system-autoproxy-settings
    /* channelId: ChannelSnowflake, */
    data: Partial<AutoproxySettings>
  ): Promise<AutoproxySettings> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/@me/guilds/${guildId}`,
      {},
      'PATCH',
      AutoproxySettings,
      AutoproxySettings.partial().parse(data)
    )
  }

  async getMember (memberRef: MemberRef): Promise<Member> {
    return this.requestParsed(`https://api.pluralkit.me/v2/members/${memberRef}`, {}, 'GET', Member)
  }

  async getMemberGroups (memberRef: MemberRef): Promise<Array<Group>> {
    return this.requestParsed(
      `https://api.pluralkit.me/v2/members/${memberRef}/groups`,
      {},
      'GET',
      z.array(Group)
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

  async createMember (member: Partial<Member> & Pick<Member, 'name'>): Promise<Member> {
    this.checkToken()

    return this.requestParsed(
      'https://api.pluralkit.me/v2/members',
      {},
      'POST',
      Member,
      Member.partial().required({ name: true }).parse(member)
    )
  }

  async updateMember (memberRef: MemberRef, member: Partial<Member>): Promise<Member> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/members/${memberRef}`,
      {},
      'PATCH',
      Member,
      Member.partial().required({ name: true }).parse(member)
    )
  }

  async deleteMember (memberRef: MemberRef): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/members/${memberRef}`,
      {},
      'DELETE'
    )

    if (resp.status !== 204) {
      throw Error(`error deleting member ${memberRef}`, {
        cause: await HTTPError.fromResponse(resp)
      })
    }
  }

  async addMemberToGroups (memberRef: MemberRef, groupRefs: Array<GroupRef>): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/members/${memberRef}/groups/add`,
      {},
      'POST',
      groupRefs
    )
    if (resp.status !== 204) {
      throw Error(`error adding member ${memberRef} to groups ${groupRefs.join(', ')}`, {
        cause: await HTTPError.fromResponse(resp)
      })
    }
  }

  async removeMemberFromGroups (memberRef: MemberRef, groupRefs: Array<GroupRef>): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/members/${memberRef}/groups/remove`,
      {},
      'POST',
      groupRefs
    )

    if (resp.status !== 204) {
      throw Error(`error removing member ${memberRef} from groups ${groupRefs.join(', ')}`, {
        cause: await HTTPError.fromResponse(resp)
      })
    }
  }

  async overwriteMemberGroups (memberRef: MemberRef, groupRefs: Array<GroupRef>): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/members/${memberRef}/groups/overwrite`,
      {},
      'POST',
      groupRefs
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
    settings: Partial<MemberGuildSettings>
  ): Promise<MemberGuildSettings> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/members/${memberRef}/guilds/${guildId}`,
      {},
      'PATCH',
      MemberGuildSettings,
      MemberGuildSettings.partial().parse(settings)
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

  async createGroup (group: Partial<Group> & Pick<Group, 'name'>): Promise<Group> {
    this.checkToken()

    return this.requestParsed(
      'https://api.pluralkit.me/v2/groups',
      {},
      'POST',
      Group,
      Group.partial().required({ name: true }).parse(group)
    )
  }

  async updateGroup (groupRef: GroupRef, data: Partial<Group>): Promise<Group> {
    this.checkToken()

    return this.requestParsed(
      `https://api.pluralkit.me/v2/groups/${groupRef}`,
      {},
      'PATCH',
      Group,
      Group.partial().parse(data)
    )
  }

  async deleteGroup (groupRef: GroupRef): Promise<void> {
    this.checkToken()

    const resp = await this.request(`https://api.pluralkit.me/v2/groups/${groupRef}`, {}, 'DELETE')

    if (resp.status !== 204) {
      throw Error(`error deleting group ${groupRef}`, {
        cause: await HTTPError.fromResponse(resp)
      })
    }
  }

  async addMembersToGroup (groupRef: GroupRef, memberRefs: Array<MemberRef>): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/groups/${groupRef}/add`,
      {},
      'POST',
      memberRefs
    )

    if (resp.status !== 204) {
      throw Error(`error deleting group ${groupRef}`, {
        cause: await HTTPError.fromResponse(resp)
      })
    }
  }

  async removeMembersFromGroup (groupRef: GroupRef, memberRefs: Array<MemberRef>): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/groups/${groupRef}/remove`,
      {},
      'POST',
      memberRefs
    )

    if (resp.status !== 204) {
      throw Error(`error deleting group ${groupRef}`, {
        cause: await HTTPError.fromResponse(resp)
      })
    }
  }

  async overwriteGroupMembers (groupRef: GroupRef, memberRefs: Array<MemberRef>): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/groups/${groupRef}/overwrite`,
      {},
      'POST',
      memberRefs
    )

    if (resp.status !== 204) {
      throw Error(`error overwriting members for group ${groupRef} with ${memberRefs.join(', ')}`, {
        cause: await HTTPError.fromResponse(resp)
      })
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
      Switch,
      data
    )
  }

  async updateSwitch (systemRef: SystemRef, switchId: SwitchID, timestamp: Date): Promise<Switch> {
    this.checkToken()

    // TODO: Narrowed type for method (members = Array<Member>)
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
    this.checkToken()

    // TODO: Narrowed type for method (members = Array<Member>)

    return this.requestParsed(
      `https://api.pluralkit.me/v2/systems/${systemRef}/switches/${switchId}/members`,
      {},
      'PATCH',
      Switch,
      memberRefs
    )
  }

  async deleteSwitch (systemRef: SystemRef, switchId: SwitchID) {
    this.checkToken()

    const resp = await this.request(
      `https://api.pluralkit.me/v2/systems/${systemRef}/switches/${switchId}`,
      {},
      'DELETE'
    )

    if (resp.status !== 204) {
      throw Error(`error deleting switch ${switchId} for system ${systemRef}`, {
        cause: await HTTPError.fromResponse(resp)
      })
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
    const headers = new Headers(data ? { 'Content-Type': 'application/json' } : {})
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

    const resp = await fetch(url + (params.size ? `?${params.toString()}` : ''), options)
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
