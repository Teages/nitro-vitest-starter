import { defineHandler, HTTPError } from 'nitro'
import { useStorage } from 'nitro/storage'

// PUT /api/count - Set count to specific value
export default defineHandler(async (event) => {
  const storage = useStorage('count')

  // Parse request body
  let body: unknown
  try {
    body = await event.req.json()
  }
  catch {
    throw new HTTPError('Invalid JSON body', { status: 400 })
  }

  // Validate body
  if (typeof body !== 'object' || body === null || !('count' in body)) {
    throw new HTTPError('Missing "count" field in request body', { status: 400 })
  }

  const { count } = body as { count: unknown }
  if (typeof count !== 'number' || !Number.isInteger(count)) {
    throw new HTTPError('"count" must be an integer', { status: 400 })
  }

  await storage.setItem('value', count)
  return { count }
})

if (import.meta.vitest) {
  const { describe, it, expect, beforeEach } = import.meta.vitest

  describe('put /api/count', async () => {
    const { serverFetch } = await import('nitro/app')
    const storage = useStorage('count')

    beforeEach(async () => {
      // Reset count before each test
      await storage.removeItem('value')
    })

    it('should set count to specific value', async () => {
      const response = await serverFetch('/api/count', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 42 }),
      })
      expect(response.status).toBe(200)

      const data: unknown = await response.json()
      expect(data).toEqual({ count: 42 })
    })

    it('should persist the set value', async () => {
      await serverFetch('/api/count', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 100 }),
      })

      const storedValue = await storage.getItem('value')
      expect(storedValue).toBe(100)
    })

    it('should return 400 when count field is missing', async () => {
      const response = await serverFetch('/api/count', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      expect(response.status).toBe(400)
    })

    it('should return 400 when count is not a number', async () => {
      const response = await serverFetch('/api/count', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 'not a number' }),
      })
      expect(response.status).toBe(400)
    })

    it('should return 400 when count is not an integer', async () => {
      const response = await serverFetch('/api/count', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 3.14 }),
      })
      expect(response.status).toBe(400)
    })

    it('should return 400 when body is invalid JSON', async () => {
      const response = await serverFetch('/api/count', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: 'not valid json',
      })
      expect(response.status).toBe(400)
    })
  })
}
