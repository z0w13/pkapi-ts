import { vi, assert, expect, test, describe, afterEach } from 'vitest'
import fetchMock from 'fetch-mock'

import StrictTypedClient from '../src/StrictTypedClient.ts'
import { GuildSnowflake } from '../src/models/DiscordSnowflake.ts'
import { AuthorizationRequired } from '../src/errors.ts'
import { SystemRef } from '../src/models/SystemID.ts'
import { mockApiSystem } from './util.ts'

afterEach(() => {
  // reset fetch-mock
  fetchMock.removeRoutes()
  fetchMock.clearHistory()
  fetchMock.unmockGlobal()

  // reset timers
  vi.useRealTimers()
})

describe('PluralKit', () => {
  test('getToken() returns the set token', () => {
    const pluralKit = new StrictTypedClient('foo')
    expect(pluralKit.getToken()).toBe('foo')
  })
  test('throws when a method that requires token is called without token', async () => {
    const pluralKit = new StrictTypedClient()
    try {
      await pluralKit.getOwnSystemAutoproxySettings(GuildSnowflake.parse('0'))
    } catch (e) {
      assert(e instanceof AuthorizationRequired)
    }
  })

  test('waits when a ratelimit error is encountered', async () => {
    fetchMock.mockGlobal()
    vi.useFakeTimers()
    const pluralKit = new StrictTypedClient()

    fetchMock.mockGlobal()
    fetchMock.getOnce('https://api.pluralkit.me/v2/systems/exmpl', {
      status: 429,
      headers: {
        'x-ratelimit-remaining': '0',
        'x-ratelimit-reset': (Math.ceil(Date.now() / 1000) + 60).toString(),
      }
    })
    fetchMock.getOnce('https://api.pluralkit.me/v2/systems/exmpl', {
      body: mockApiSystem({
        id: 'exmpl',
        uuid: '8b5eac7a-b019-416f-a9ad-89f62225a815',
      }),
    })

    await expect(pluralKit.getSystem(SystemRef.parse('exmpl'))).toResolveAfterAtLeast(60000)
  })
  test('waits when we have no remaining ratelimit requests', async () => {
    fetchMock.mockGlobal()
    vi.useFakeTimers()
    const pluralKit = new StrictTypedClient()

    fetchMock.get('https://api.pluralkit.me/v2/systems/exmpl', {
      headers: {
        'x-ratelimit-remaining': '0',
        'x-ratelimit-reset': (Math.ceil(Date.now() / 1000) + 60).toString(),
      },
      body: mockApiSystem({
        id: 'exmpl',
        uuid: '8b5eac7a-b019-416f-a9ad-89f62225a815',
      }),
    })
    fetchMock.get('https://api.pluralkit.me/v2/systems/system', {
      body: mockApiSystem({
        id: 'system',
        uuid: 'b1646a57-f1c0-4075-9810-b44760efeca2',
      })
    })

    await pluralKit.getSystem(SystemRef.parse('exmpl'))
    await expect(pluralKit.getSystem(SystemRef.parse('system'))).toResolveAfterAtLeast(60000)
  })

  test('deduplicates get requests when `deduplicateGetRequests` is true', async () => {
    vi.useFakeTimers()
    fetchMock.mockGlobal()

    fetchMock.get('https://api.pluralkit.me/v2/systems/exmpl', {
      headers: {
        'x-ratelimit-remaining': '0',
        'x-ratelimit-reset': (Math.ceil(Date.now() / 1000) + 60).toString(),
      },
      body: mockApiSystem({
        id: 'exmpl',
        uuid: '8b5eac7a-b019-416f-a9ad-89f62225a815',
      }),
    }, { name: 'getSystem', delay: 50 })

    const pluralKit = new StrictTypedClient(null, true)
    const prom = Promise.all([
      pluralKit.getSystem(SystemRef.parse('exmpl')),
      pluralKit.getSystem(SystemRef.parse('exmpl'))
    ])
    await vi.runAllTimersAsync()
    await prom

    expect(fetchMock.callHistory.calls('getSystem')).toHaveLength(1)
  })

  test("doesn't deduplicates get requests when `deduplicateGetRequests` is false", async () => {
    vi.useFakeTimers()
    fetchMock.mockGlobal()

    fetchMock.get('https://api.pluralkit.me/v2/systems/exmpl', {
      headers: {
        'x-ratelimit-remaining': '0',
        'x-ratelimit-reset': (Math.ceil(Date.now() / 1000) + 60).toString(),
      },
      body: mockApiSystem({
        id: 'exmpl',
        uuid: '8b5eac7a-b019-416f-a9ad-89f62225a815',
      }),
    }, { name: 'getSystem', delay: 50 })

    const pluralKit = new StrictTypedClient(null, false)
    const prom = Promise.all([
      pluralKit.getSystem(SystemRef.parse('exmpl')),
      pluralKit.getSystem(SystemRef.parse('exmpl'))
    ])
    await vi.runAllTimersAsync()
    await prom

    expect(fetchMock.callHistory.calls('getSystem')).toHaveLength(2)
  })
})
