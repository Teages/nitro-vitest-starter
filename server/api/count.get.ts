import { defineHandler } from 'nitro/h3'
import { useStorage } from 'nitro/storage'

// GET /api/count - Get current count
export default defineHandler(async () => {
  const storage = useStorage('count')
  const count = await storage.getItem<number>('value') ?? 0
  return { count }
})

if (import.meta.vitest) {
  const { describe, it, expect, beforeEach } = import.meta.vitest

  describe('get /api/count', async () => {
    const { serverFetch } = await import('nitro/app')
    const storage = useStorage('count')

    beforeEach(async () => {
      // Reset count before each test
      await storage.removeItem('value')
    })

    it('should return 0 when no count is set', async () => {
      const response = await serverFetch('/api/count', { method: 'GET' })
      expect(response.status).toBe(200)

      const data: unknown = await response.json()
      expect(data).toEqual({ count: 0 })
    })

    it('should return the current count', async () => {
      await storage.setItem('value', 5)

      const response = await serverFetch('/api/count', { method: 'GET' })
      expect(response.status).toBe(200)

      const data: unknown = await response.json()
      expect(data).toEqual({ count: 5 })
    })
  })
}
