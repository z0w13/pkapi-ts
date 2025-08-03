import z, { ZodType } from 'zod'
import { objectToCamel, objectToSnake } from 'ts-case-convert'

import { APIError, HTTPError, AuthorizationRequired } from './errors.ts'

import BaseRateLimiter from './RateLimiter/BaseRateLimiter.ts'
import DefaultRateLimiter from './RateLimiter/DefaultRateLimiter.ts'

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

// From https://pluralkit.me/api/#rate-limiting
type BucketNames = 'generic_get' | 'generic_update' | 'message'

export interface Options {
  token?: string | null
}

export default class StrictTypedClient {
  protected getRequestPromiseMap: Map<string, Promise<Response>>
  constructor (
    protected token: string | null = null,
    protected deduplicateGetRequests = false,
    protected baseURL: string | null = 'https://api.pluralkit.me',
    protected rateLimiter: BaseRateLimiter = new DefaultRateLimiter()
  ) {
    this.getRequestPromiseMap = new Map()
  }

  public getToken () {
    return this.token
  }

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
      `/v2/systems/${systemRef}`,
      {},
      'GET',
      SystemFromApi,
      undefined,
      'generic_get',
      options
    )
  }

  async getSystemSettings (
    systemRef: SystemRef,
    options: Options = {}
  ): Promise<PublicSystemSettings> {
    return this.requestParsed(
      `/v2/systems/${systemRef}/settings`,
      {},
      'GET',
      PublicSystemSettings,
      undefined,
      'generic_get',
      options
    )
  }

  async getOwnSystemSettings (options: Options = {}): Promise<SystemSettings> {
    this.checkToken()

    return this.requestParsed(
      '/v2/systems/@me/settings',
      {},
      'GET',
      SystemSettings,
      undefined,
      'generic_get',
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
      '/v2/systems/@me/autoproxy',
      { guild_id: guildId },
      'GET',
      AutoproxySettingsFromApi,
      undefined,
      'generic_get',
      options
    )
  }

  async getOwnSystemGuildSettings (
    guildId: GuildSnowflake,
    options: Options = {}
  ): Promise<SystemGuildSettings> {
    this.checkToken()

    return this.requestParsed(
      `/v2/systems/@me/guilds/${guildId}`,
      {},
      'GET',
      SystemGuildSettings,
      undefined,
      'generic_get',
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
      `/v2/systems/${systemRef}`,
      {},
      'PATCH',
      SystemFromApi,
      System.partial().parse(data),
      'generic_update',
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
      `/v2/systems/${systemRef}/settings`,
      {},
      'PATCH',
      SystemSettings,
      SystemSettings.partial().parse(data),
      'generic_update',
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
      `/v2/systems/@me/guilds/${guildId}`,
      {},
      'PATCH',
      SystemGuildSettings,
      SystemGuildSettings.partial().parse(data),
      'generic_update',
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
      '/v2/systems/@me/autoproxy',
      { guild_id: guildId },
      'PATCH',
      AutoproxySettingsFromApi,
      AutoproxySettings.partial().parse(data),
      'generic_update',
      options
    )
  }

  async getMember (memberRef: MemberRef, options: Options = {}): Promise<Member> {
    return this.requestParsed(
      `/v2/members/${memberRef}`,
      {},
      'GET',
      MemberFromApi,
      undefined,
      'generic_get',
      options
    )
  }

  async getSystemMembers (systemRef: SystemRef, options: Options = {}): Promise<Array<Member>> {
    return this.requestParsed(
      `/v2/systems/${systemRef}/members`,
      {},
      'GET',
      z.array(MemberFromApi),
      undefined,
      'generic_get',
      options
    )
  }

  async getMemberGroups (memberRef: MemberRef, options: Options = {}): Promise<Array<Group>> {
    return this.requestParsed(
      `/v2/members/${memberRef}/groups`,
      {},
      'GET',
      z.array(Group),
      undefined,
      'generic_get',
      options
    )
  }

  async getMemberGuildSettings (
    memberRef: MemberRef,
    guildId: GuildSnowflake,
    options: Options = {}
  ): Promise<MemberGuildSettings> {
    return this.requestParsed(
      `/v2/members/${memberRef}/guilds/${guildId}`,
      {},
      'GET',
      MemberGuildSettings,
      undefined,
      'generic_get',
      options
    )
  }

  async createMember (
    member: Partial<Member> & Pick<Member, 'name'>,
    options: Options = {}
  ): Promise<Member> {
    this.checkToken()

    return this.requestParsed(
      '/v2/members',
      {},
      'POST',
      MemberFromApi,
      MemberToApi.partial().required({ name: true }).parse(member),
      'generic_update',
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
      `/v2/members/${memberRef}`,
      {},
      'PATCH',
      MemberFromApi,
      MemberToApi.partial().required({ name: true }).parse(member),
      'generic_update',
      options
    )
  }

  async deleteMember (memberRef: MemberRef, options: Options = {}): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `/v2/members/${memberRef}`,
      {},
      'DELETE',
      undefined,
      'generic_update',
      options
    )

    if (resp.status !== 204) {
      throw Error(`error deleting member ${memberRef}`, {
        cause: HTTPError.fromResponse(resp, await resp.text())
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
      `/v2/members/${memberRef}/groups/add`,
      {},
      'POST',
      groupRefs,
      'generic_update',
      options
    )
    if (resp.status !== 204) {
      throw Error(`error adding member ${memberRef} to groups ${groupRefs.join(', ')}`, {
        cause: HTTPError.fromResponse(resp, await resp.text())
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
      `/v2/members/${memberRef}/groups/remove`,
      {},
      'POST',
      groupRefs,
      'generic_update',
      options
    )

    if (resp.status !== 204) {
      throw Error(`error removing member ${memberRef} from groups ${groupRefs.join(', ')}`, {
        cause: HTTPError.fromResponse(resp, await resp.text())
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
      `/v2/members/${memberRef}/groups/overwrite`,
      {},
      'POST',
      groupRefs,
      'generic_update',
      options
    )

    if (resp.status !== 204) {
      throw Error(`error overwriting groups for member ${memberRef} with ${groupRefs.join(', ')}`, {
        cause: HTTPError.fromResponse(resp, await resp.text())
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
      `/v2/members/${memberRef}/guilds/${guildId}`,
      {},
      'PATCH',
      MemberGuildSettings,
      MemberGuildSettings.partial().parse(settings),
      'generic_update',
      options
    )
  }

  async getGroup (groupRef: GroupRef, options: Options = {}): Promise<Group> {
    return this.requestParsed(
      `/v2/groups/${groupRef}`,
      {},
      'GET',
      Group,
      undefined,
      'generic_get',
      options
    )
  }

  async getGroups (systemRef: SystemRef, options: Options = {}): Promise<Array<Group>> {
    return this.requestParsed(
     `/v2/systems/${systemRef}/groups`,
     {},
     'GET',
     z.array(Group),
     undefined,
     'generic_get',
     options
    )
  }

  async getGroupMembers (groupRef: GroupRef, options: Options = {}): Promise<Array<Member>> {
    return this.requestParsed(
      `/v2/groups/${groupRef}/members`,
      {},
      'GET',
      z.array(MemberFromApi),
      undefined,
      'generic_get',
      options
    )
  }

  async createGroup (
    group: Partial<Group> & Pick<Group, 'name'>,
    options: Options = {}
  ): Promise<Group> {
    this.checkToken()

    return this.requestParsed(
      '/v2/groups',
      {},
      'POST',
      Group,
      Group.partial().required({ name: true }).parse(group),
      'generic_update',
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
      `/v2/groups/${groupRef}`,
      {},
      'PATCH',
      Group,
      Group.partial().parse(data),
      'generic_update',
      options
    )
  }

  async deleteGroup (groupRef: GroupRef, options: Options = {}): Promise<void> {
    this.checkToken()

    const resp = await this.request(
      `/v2/groups/${groupRef}`,
      {},
      'DELETE',
      undefined,
      'generic_update',
      options
    )

    if (resp.status !== 204) {
      throw Error(`error deleting group ${groupRef}`, {
        cause: HTTPError.fromResponse(resp, await resp.text())
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
      `/v2/groups/${groupRef}/members/add`,
      {},
      'POST',
      memberRefs,
      'generic_update',
      options
    )

    if (resp.status !== 204) {
      throw Error(`error deleting group ${groupRef}`, {
        cause: HTTPError.fromResponse(resp, await resp.text())
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
      `/v2/groups/${groupRef}/members/remove`,
      {},
      'POST',
      memberRefs,
      'generic_update',
      options
    )

    if (resp.status !== 204) {
      throw Error(`error deleting group ${groupRef}`, {
        cause: HTTPError.fromResponse(resp, await resp.text())
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
      `/v2/groups/${groupRef}/members/overwrite`,
      {},
      'POST',
      memberRefs,
      'generic_update',
      options
    )

    if (resp.status !== 204) {
      throw Error(`error overwriting members for group ${groupRef} with ${memberRefs.join(', ')}`, {
        cause: HTTPError.fromResponse(resp, await resp.text())
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
      `/v2/systems/${systemRef}/switches`,
      params,
      'GET',
      z.array(SwitchWithMemberIDsFromApi),
      undefined,
      'generic_get',
      options
    )
  }

  async getSwitch (
    systemRef: SystemRef,
    switchId: SwitchID,
    options: Options = {}
  ): Promise<SwitchWithMembers> {
    return this.requestParsed(
      `/v2/systems/${systemRef}/switches/${switchId}`,
      {},
      'GET',
      SwitchWithMembersFromApi,
      undefined,
      'generic_get',
      options
    )
  }

  async getFronters (systemRef: SystemRef, options: Options = {}): Promise<SwitchWithMembers> {
    return this.requestParsed(
      `/v2/systems/${systemRef}/fronters`,
      {},
      'GET',
      SwitchWithMembersFromApi,
      undefined,
      'generic_get',
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
      `/v2/systems/${systemRef}/switches`,
      {},
      'POST',
      SwitchWithMembersFromApi,
      data,
      'generic_update',
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
      `/v2/systems/${systemRef}/switches/${switchId}`,
      {},
      'PATCH',
      SwitchWithMembersFromApi,
      { timestamp: timestamp.toISOString() },
      'generic_update',
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
      `/v2/systems/${systemRef}/switches/${switchId}/members`,
      {},
      'PATCH',
      SwitchWithMembersFromApi,
      memberRefs,
      'generic_update',
      options
    )
  }

  async deleteSwitch (systemRef: SystemRef, switchId: SwitchID, options: Options = {}) {
    this.checkToken()

    const resp = await this.request(
      `/v2/systems/${systemRef}/switches/${switchId}`,
      {},
      'DELETE',
      undefined,
      'generic_update',
      options
    )

    if (resp.status !== 204) {
      throw Error(`error deleting switch ${switchId} for system ${systemRef}`, {
        cause: HTTPError.fromResponse(resp, await resp.text())
      })
    }
  }

  async getProxiedMessageInformation (
    messageId: MessageSnowflake,
    options: Options = {}
  ): Promise<Message> {
    return this.requestParsed(
      `/v2/messages/${messageId}`,
      {},
      'GET',
      MessageFromApi,
      undefined,
      'message',
      options
    )
  }

  protected getPromiseKey (path: string, parameters: Record<string, string>, options: Options) {
    return JSON.stringify({ path, parameters, token: options.token ?? this.token })
  }

  protected async innerRequest (
    path: string,
    params: URLSearchParams,
    requestOptions: RequestInit,
    bucket: BucketNames
  ) {
    while (true) {
      // wait for ratelimits
      await this.rateLimiter.wait(bucket)

      const resp = await fetch(this.baseURL + path + (params.size ? `?${params.toString()}` : ''), requestOptions)
      if (resp.status < 200 || resp.status > 299) {
        if (await this.rateLimiter.handleError(bucket, resp)) {
          // retry if ratelimiter handled the error
          continue
        }

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

      await this.rateLimiter.handleResponse(bucket, resp)
      return resp
    }
  }

  async request<T>(
    path: string,
    parameters: Record<string, string> = {},
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    data: T | undefined,
    bucket: BucketNames,
    options: Options
  ): Promise<Response> {
    console.log({ path, parameters, method, bucket })
    const headers = new Headers(data ? { 'Content-Type': 'application/json' } : {})
    if (this.token) {
      headers.append('Authorization', this.token ?? options.token)
    }

    const getRequestPromiseKey = this.getPromiseKey(path, parameters, options)
    if (
      this.deduplicateGetRequests &&
      method === 'GET' &&
      this.getRequestPromiseMap.has(getRequestPromiseKey)
    ) {
      return this.getRequestPromiseMap.get(getRequestPromiseKey)!
    }

    const params = new URLSearchParams(parameters)
    const requestOptions: RequestInit = {
      method,
      headers
    }
    if (data) {
      requestOptions.body = JSON.stringify(objectToSnake(data))
    }

    const prom = this.innerRequest(path, params, requestOptions, bucket)
    if (this.deduplicateGetRequests && method === 'GET') {
      this.getRequestPromiseMap.set(getRequestPromiseKey, prom)
      prom.finally(() => this.getRequestPromiseMap.delete(getRequestPromiseKey))
    }

    // TODO: More elegant solution for body re-use than just cloning the response
    return prom.then(resp => resp.clone())
  }

  async requestParsed<O, T>(
    path: string,
    parameters: Record<string, string> = {},
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    schema: ZodType<O>,
    data: T | undefined,
    bucket: BucketNames,
    options: Options
  ): Promise<O> {
    const resp = await this.request(path, parameters, method, data, bucket, options)
    const json = await resp.json()
    if (typeof json !== 'object' || json === null) {
      throw new Error(`Expected JSON object, got ${JSON.stringify(json)} instead`)
    }

    return schema.parse(objectToCamel(json))
  }
}
