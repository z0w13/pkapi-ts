import Client from '../Client.ts'

export interface APIData {
  base_url?: string;
  version?: number;
  token?: string;
  user_agent?: string;
  debug?: boolean;
}

export interface RequestOptions {
  token?: string;
}

export interface GetSystemOptions extends RequestOptions {
  system?: string;
  fetch?: Array<SystemFetchOptions>;
  raw?: boolean;
}

export const enum SystemFetchOptions {
  Members = 'members',
  Fronters = 'fronters',
  Switches = 'switches',
  Groups = 'groups',
  Config = 'config',
  GroupMembers = 'group members',
}

export type RequestData<T extends {}> = T & {
  token?: string;
}

export default class PKAPIClient {
  // TODO: Implement in Client
  protected _base: string
  protected client: Client

  constructor (data?: APIData) {
    if (data?.version === 1) {
      throw new Error('Only PluralKit API v2 is supported')
    }

    if (data?.user_agent) {
      console.warn('PKAPIClient: `user_agent` option is unsupported')
    }
    if (data?.debug) {
      console.warn('PKAPIClient: `debug` option is unsupported')
    }

    this._base = data?.base_url ?? 'https://api.pluralkit.me'
    this.client = new Client(data?.token)
  }

  public async getSystem (data: GetSystemOptions = {}) {
    const token = this.client.getToken() ?? data.token

    if (data.system == null && !token) {
      throw new Error('Must provide a token or ID.')
    }

    const system = token
      ? await this.client.getSystem('@me', { token })
      // NOTE: We can't get past the above error if system is null
      : await this.client.getSystem(data.system!)

    if (data.fetch) {
      // TODO: Somehow assign all these to a system-esque object
      if (data.fetch.includes(SystemFetchOptions.Members)) {
        const members = this.client.getSystemMembers(system.id, { token })
      }
      if (data.fetch.includes(SystemFetchOptions.Fronters)) {
        const fronters = this.client.getFronters(system.id, { token })
      }
      if (data.fetch.includes(SystemFetchOptions.Switches)) {
        // TODO: data.raw option?
        const switches = this.client.getSwitches(system.id, undefined, undefined, { token })
      }
      if (data.fetch.includes(SystemFetchOptions.Groups)) {
        const groups = this.client.getGroups(system.id, { token })
      }
      if (data.fetch.includes(SystemFetchOptions.Config)) {
        const settings = this.client.getSystemSettings(system.id, { token })
      }
    }

    // TODO: Convert to pkapi.js compatible type
    return system
  }

  public async getAccount (data: GetSystemOptions = {}) {
    // TODO: Convert to pkapi.js compatible type
    return this.getSystem(data)
  }

  // TODO: Accept data as pkapi.js compatible type
  public async patchSystem (data: Partial<System> & { token?: string | null } = {}) {
    const token = this.client.getToken() ?? data.token
    if (!token) {
      throw new Error('PATCH requires a token.')
    }

    // TODO: Convert to pkapi.js compatible type
    return await this.client.updateSystem('@me', data, { token })
  }

  public async getSystemConfig (data: RequestOptions = {}) {
    const token = this.client.getToken() ?? data.token
    if (!token) {
      throw new Error('PATCH requires a token.')
    }

    // TODO: Convert to pkapi.js compatible type
    return this.client.getSystemSettings('@me', { token })
  }

  // TODO: Accept data as pkapi.js compatible type
  public async patchSystemConfig (data: Partial<SystemConfig>) {
    const token = this.client.getToken() ?? data.token
    if (!token) {
      throw new Error('PATCH requires a token.')
    }

    return this.client.updateSystemSettings('@me', data, { token })
  }

  public async getSystemGuildSettings (data: { token?: string, guild: string }) {
    const token = this.client.getToken() ?? data.token
    if (!token) {
      throw new Error('PATCH requires a token.')
    }
  }
}
