import { describe, expect, it, vi } from 'vitest'
import { createCounter } from '~/app/counter'

describe('createCounter', () => {
  const createMockFetch = (responses: Partial<Response>[]): (() => Promise<Response>) => {
    let callIndex = 0
    return vi.fn(async () => {
      const responseConfig = responses[callIndex % responses.length]!
      callIndex++
      return {
        ok: responseConfig.ok ?? true,
        status: responseConfig.status ?? 200,
        json: responseConfig.json ?? (async () => ({})),
      } as Response
    }) as unknown as () => Promise<Response>
  }

  it('should initialize with default value 0', async () => {
    const mockFetch = createMockFetch([])
    const counter = createCounter(0, mockFetch)
    expect(await counter.getCount()).toBe(0)
  })

  it('should initialize with custom value', async () => {
    const mockFetch = createMockFetch([])
    const counter = createCounter(10, mockFetch)
    expect(await counter.getCount()).toBe(10)
  })

  it('should increment count by 1', async () => {
    const mockFetch = createMockFetch([
      { status: 200, json: async () => ({ count: 6 }) },
    ])
    const counter = createCounter(5, mockFetch)
    await counter.increment()
    expect(await counter.getCount()).toBe(6)
  })

  it('should set count to specific value', async () => {
    const mockFetch = createMockFetch([
      { status: 200, json: async () => ({ count: 42 }) },
    ])
    const counter = createCounter(0, mockFetch)
    await counter.setCount(42)
    expect(await counter.getCount()).toBe(42)
  })

  it('should call onCountChanged callback when incrementing', async () => {
    const mockFetch = createMockFetch([
      { status: 200, json: async () => ({ count: 1 }) },
    ])
    const counter = createCounter(0, mockFetch)
    const callback = vi.fn()
    counter.onCountChanged(callback)

    await counter.increment()
    expect(callback).toHaveBeenCalledWith(1)
  })

  it('should call onCountChanged callback when setting value', async () => {
    const mockFetch = createMockFetch([
      { status: 200, json: async () => ({ count: 100 }) },
    ])
    const counter = createCounter(0, mockFetch)
    const callback = vi.fn()
    counter.onCountChanged(callback)

    await counter.setCount(100)
    expect(callback).toHaveBeenCalledWith(100)
  })

  it('should throw error when getCount fails without initial value', async () => {
    const mockFetch = createMockFetch([
      { ok: false, status: 500, json: async () => ({ error: 'Server error' }) },
    ])
    const counter = createCounter(undefined, mockFetch)

    await expect(counter.getCount()).rejects.toThrow('Failed to get count: 500')
  })
})
