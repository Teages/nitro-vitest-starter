import { describe, expect, it, vi } from 'vitest'

export type CountChangedCallback = (count: number) => void

export interface Counter {
  getCount: () => Promise<number>
  setCount: (value: number) => Promise<void>
  onCountChanged: (callback: CountChangedCallback) => void
  increment: () => Promise<void>
}

/**
 * Create a counter that syncs with the server API
 * @param initialValue - Initial value (fetched from server if not provided)
 * @param fetch - Fetch function for testing (defaults to global fetch)
 */
export function createCounter(initialValue?: number, fetch: typeof globalThis.fetch = globalThis.fetch): Counter {
  let changeCallback: CountChangedCallback | null = null
  let localCount: number | null = initialValue ?? null

  const fetchCount = async (): Promise<number> => {
    const response = await fetch('/api/count', { method: 'GET' })
    if (!response.ok) {
      throw new Error(`Failed to get count: ${response.status}`)
    }
    const data = await response.json() as { count: number }
    localCount = data.count
    return data.count
  }

  const getCount = async (): Promise<number> => {
    if (localCount !== null) {
      return localCount
    }
    return fetchCount()
  }

  const setCount = async (value: number): Promise<void> => {
    const response = await fetch('/api/count', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: value }),
    })
    if (!response.ok) {
      throw new Error(`Failed to set count: ${response.status}`)
    }
    const data = await response.json() as { count: number }
    localCount = data.count
    changeCallback?.(localCount)
  }

  const onCountChanged = (callback: CountChangedCallback): void => {
    changeCallback = callback
  }

  const increment = async (): Promise<void> => {
    const response = await fetch('/api/count', { method: 'POST' })
    if (!response.ok) {
      throw new Error(`Failed to increment count: ${response.status}`)
    }
    const data = await response.json() as { count: number }
    localCount = data.count
    changeCallback?.(localCount)
  }

  return {
    getCount,
    setCount,
    onCountChanged,
    increment,
  }
}

if (import.meta.vitest) {
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

    it('should initialize with default value when provided', async () => {
      const mockFetch = createMockFetch([
        { status: 200, json: async () => ({ count: 0 }) },
      ])
      const counter = createCounter(0, mockFetch)

      expect(await counter.getCount()).toBe(0)
      // Should not fetch from server when initial value is provided
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should fetch count from server when no initial value', async () => {
      const mockFetch = createMockFetch([
        { status: 200, json: async () => ({ count: 10 }) },
      ])
      const counter = createCounter(undefined, mockFetch)

      expect(await counter.getCount()).toBe(10)
      expect(mockFetch).toHaveBeenCalledWith('/api/count', { method: 'GET' })
    })

    it('should increment count via POST request', async () => {
      const mockFetch = createMockFetch([
        { status: 200, json: async () => ({ count: 1 }) },
        { status: 200, json: async () => ({ count: 2 }) },
      ])
      const counter = createCounter(0, mockFetch)

      await counter.increment()
      expect(await counter.getCount()).toBe(1)
      expect(mockFetch).toHaveBeenCalledWith('/api/count', { method: 'POST' })
    })

    it('should set count via PUT request', async () => {
      const mockFetch = createMockFetch([
        { status: 200, json: async () => ({ count: 42 }) },
      ])
      const counter = createCounter(0, mockFetch)

      await counter.setCount(42)
      expect(mockFetch).toHaveBeenCalledWith('/api/count', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 42 }),
      })
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

    it('should throw error when increment fails', async () => {
      const mockFetch = createMockFetch([
        { ok: false, status: 500, json: async () => ({ error: 'Server error' }) },
      ])
      const counter = createCounter(0, mockFetch)

      await expect(counter.increment()).rejects.toThrow('Failed to increment count: 500')
    })

    it('should throw error when setCount fails', async () => {
      const mockFetch = createMockFetch([
        { ok: false, status: 400, json: async () => ({ error: 'Bad request' }) },
      ])
      const counter = createCounter(0, mockFetch)

      await expect(counter.setCount('invalid' as unknown as number)).rejects.toThrow('Failed to set count: 400')
    })
  })
}
