import z from 'zod'

import StrictTypedClient, { Options } from './StrictTypedClient.ts'
import System, { SimpleSystem } from './models/System.ts'
import Member, { SimpleMember } from './models/Member.ts'
import Group, { SimpleGroup } from './models/Group.ts'
import SystemSettings from './models/SystemSettings.ts'
import PublicSystemSettings from './models/PublicSystemSettings.ts'
import { GuildSnowflake, MessageSnowflake } from './models/DiscordSnowflake.ts'
import SystemGuildSettings from './models/SystemGuildSettings.ts'
import AutoproxySettings from './models/AutoproxySettings.ts'
import { GroupRef } from './models/GroupID.ts'
import MemberGuildSettings from './models/MemberGuildSettings.ts'
import {
  SwitchWithMemberIDs,
  SwitchWithMembers,
} from './models/Switch.ts'
import Message from './models/Message.ts'
import { SystemRef } from './models/SystemID.ts'
import { MemberRef } from './models/MemberID.ts'
import { SwitchID } from './models/SwitchID.ts'

export default class Client extends StrictTypedClient {
  async getSystem (systemRef: string, options: Options = {}): Promise<System> {
    return super.getSystem(SystemRef.parse(systemRef), options)
  }

  async getSystemSettings (
    systemRef: string,
    options: Options = {}
  ): Promise<PublicSystemSettings> {
    return super.getSystemSettings(SystemRef.parse(systemRef), options)
  }

  async getOwnSystemAutoproxySettings (
    guildId: string,
    /* channelId: string, */
    options: Options = {}
  ): Promise<AutoproxySettings> {
    return super.getOwnSystemAutoproxySettings(GuildSnowflake.parse(guildId), options)
  }

  async getOwnSystemGuildSettings (
    guildId: string,
    options: Options = {}
  ): Promise<SystemGuildSettings> {
    return super.getOwnSystemGuildSettings(GuildSnowflake.parse(guildId), options)
  }

  async updateSystem (
    systemRef: string,
    data: Partial<SimpleSystem>,
    options: Options = {}
  ): Promise<System> {
    return super.updateSystem(SystemRef.parse(systemRef), System.partial().parse(data), options)
  }

  async updateSystemSettings (
    systemRef: string,
    data: Partial<SystemSettings>,
    options: Options = {}
  ): Promise<SystemSettings> {
    return super.updateSystemSettings(SystemRef.parse(systemRef), data, options)
  }

  async updateOwnSystemGuildSettings (
    guildId: string,
    data: Partial<SystemGuildSettings>,
    options: Options = {}
  ): Promise<SystemGuildSettings> {
    return super.updateOwnSystemGuildSettings(GuildSnowflake.parse(guildId), data, options)
  }

  async updateOwnSystemAutoproxySettings (
    guildId: string,
    // NOTE: Currently unsupported, see
    //       https://pluralkit.me/api/endpoints/#update-system-autoproxy-settings
    /* channelId: string, */
    data: Partial<AutoproxySettings>,
    options: Options = {}
  ): Promise<AutoproxySettings> {
    return super.updateOwnSystemAutoproxySettings(GuildSnowflake.parse(guildId), data, options)
  }

  async getMember (memberRef: string, options: Options = {}): Promise<Member> {
    return super.getMember(MemberRef.parse(memberRef), options)
  }

  async getSystemMembers (systemRef: string, options: Options = {}): Promise<Array<Member>> {
    return super.getSystemMembers(SystemRef.parse(systemRef), options)
  }

  async getMemberGroups (memberRef: string, options: Options = {}): Promise<Array<Group>> {
    return super.getMemberGroups(MemberRef.parse(memberRef), options)
  }

  async getMemberGuildSettings (
    memberRef: string,
    guildId: string,
    options: Options = {}
  ): Promise<MemberGuildSettings> {
    return super.getMemberGuildSettings(MemberRef.parse(memberRef), GuildSnowflake.parse(guildId), options)
  }

  async createMember (
    member: Partial<SimpleMember> & Pick<SimpleMember, 'name'>,
    options: Options = {}
  ): Promise<Member> {
    return super.createMember(Member.partial().required({ name: true }).parse(member), options)
  }

  async updateMember (
    memberRef: string,
    member: Partial<SimpleMember>,
    options: Options = {}
  ): Promise<Member> {
    return super.updateMember(MemberRef.parse(memberRef), Member.partial().parse(member), options)
  }

  async deleteMember (memberRef: string, options: Options = {}): Promise<void> {
    return super.deleteMember(MemberRef.parse(memberRef), options)
  }

  async addMemberToGroups (
    memberRef: string,
    groupRefs: Array<string>,
    options: Options = {}
  ): Promise<void> {
    return super.addMemberToGroups(MemberRef.parse(memberRef), groupRefs.map(g => GroupRef.parse(g)), options)
  }

  async removeMemberFromGroups (
    memberRef: string,
    groupRefs: Array<string>,
    options: Options = {}
  ): Promise<void> {
    return super.removeMemberFromGroups(MemberRef.parse(memberRef), z.array(GroupRef).parse(groupRefs), options)
  }

  async overwriteMemberGroups (
    memberRef: string,
    groupRefs: Array<string>,
    options: Options = {}
  ): Promise<void> {
    return super.overwriteMemberGroups(MemberRef.parse(memberRef), z.array(GroupRef).parse(groupRefs), options)
  }

  async updateMemberGuildSettings (
    memberRef: string,
    guildId: string,
    settings: Partial<MemberGuildSettings>,
    options: Options = {}
  ): Promise<MemberGuildSettings> {
    return super.updateMemberGuildSettings(MemberRef.parse(memberRef), GuildSnowflake.parse(guildId), settings, options)
  }

  async getGroup (groupRef: string, options: Options = {}): Promise<Group> {
    return super.getGroup(GroupRef.parse(groupRef), options)
  }

  async getGroups (systemRef: string, options: Options = {}): Promise<Array<Group>> {
    return super.getGroups(SystemRef.parse(systemRef), options)
  }

  async getGroupMembers (groupRef: string, options: Options = {}): Promise<Array<Member>> {
    return super.getGroupMembers(GroupRef.parse(groupRef), options)
  }

  async createGroup (
    group: Partial<SimpleGroup> & Pick<SimpleGroup, 'name'>,
    options: Options = {}
  ): Promise<Group> {
    return super.createGroup(Group.partial().required({ name: true }).parse(group), options)
  }

  async updateGroup (
    groupRef: string,
    data: Partial<SimpleGroup>,
    options: Options = {}
  ): Promise<Group> {
    return super.updateGroup(GroupRef.parse(groupRef), Group.partial().parse(data), options)
  }

  async deleteGroup (groupRef: string, options: Options = {}): Promise<void> {
    return super.deleteGroup(GroupRef.parse(groupRef), options)
  }

  async addMembersToGroup (
    groupRef: string,
    memberRefs: Array<string>,
    options: Options = {}
  ): Promise<void> {
    return super.addMembersToGroup(GroupRef.parse(groupRef), z.array(MemberRef).parse(memberRefs), options)
  }

  async removeMembersFromGroup (
    groupRef: string,
    memberRefs: Array<string>,
    options: Options = {}
  ): Promise<void> {
    return super.removeMembersFromGroup(GroupRef.parse(groupRef), z.array(MemberRef).parse(memberRefs), options)
  }

  async overwriteGroupMembers (
    groupRef: string,
    memberRefs: Array<string>,
    options: Options = {}
  ): Promise<void> {
    return super.overwriteGroupMembers(GroupRef.parse(groupRef), z.array(MemberRef).parse(memberRefs), options)
  }

  async getSwitches (
    systemRef: string,
    limit = 100,
    before?: Date,
    options: Options = {}
  ): Promise<Array<SwitchWithMemberIDs>> {
    return super.getSwitches(SystemRef.parse(systemRef), limit, before, options)
  }

  async getSwitch (
    systemRef: string,
    switchId: string,
    options: Options = {}
  ): Promise<SwitchWithMembers> {
    return super.getSwitch(SystemRef.parse(systemRef), SwitchID.parse(switchId), options)
  }

  async getFronters (systemRef: string, options: Options = {}): Promise<SwitchWithMembers> {
    return super.getFronters(SystemRef.parse(systemRef), options)
  }

  async createSwitch (
    systemRef: string,
    memberRefs: Array<string>,
    timestamp?: Date,
    options: Options = {}
  ): Promise<SwitchWithMembers> {
    return super.createSwitch(SystemRef.parse(systemRef), z.array(MemberRef).parse(memberRefs), timestamp, options)
  }

  async updateSwitch (
    systemRef: string,
    switchId: string,
    timestamp: Date,
    options: Options = {}
  ): Promise<SwitchWithMembers> {
    return super.updateSwitch(SystemRef.parse(systemRef), SwitchID.parse(switchId), timestamp, options)
  }

  async updateSwitchMembers (
    systemRef: string,
    switchId: string,
    memberRefs: Array<string>,
    options: Options = {}
  ): Promise<SwitchWithMembers> {
    return super.updateSwitchMembers(SystemRef.parse(systemRef), SwitchID.parse(switchId), z.array(MemberRef).parse(memberRefs), options)
  }

  async deleteSwitch (systemRef: string, switchId: string, options: Options = {}) {
    return super.deleteSwitch(SystemRef.parse(systemRef), SwitchID.parse(switchId), options)
  }

  async getProxiedMessageInformation (
    messageId: string,
    options: Options = {}
  ): Promise<Message> {
    return super.getProxiedMessageInformation(MessageSnowflake.parse(messageId), options)
  }
}
