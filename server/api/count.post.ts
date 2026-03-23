import { defineHandler } from 'nitro/h3'
import { useStorage } from 'nitro/storage'

// POST /api/count - Increment count by 1
export default defineHandler(async () => {
  const storage = useStorage('count')
  const currentCount = await storage.getItem<number>('value') ?? 0
  const newCount = currentCount + 1
  await storage.setItem('value', newCount)
  return { count: newCount }
})

if (import.meta.vitest) {
  const { describe, it, expect, beforeEach } = import.meta.vitest

  describe('post /api/count', async () => {
    const { serverFetch } = await import('nitro/app')
    const storage = useStorage('count')

    beforeEach(async () => {
      // Reset count before each test
      await storage.removeItem('value')
    })

    it('should increment count from 0 to 1', async () => {
      const response = await serverFetch('/api/count', { method: 'POST' })
      expect(response.status).toBe(200)

      const data: unknown = await response.json()
      expect(data).toEqual({ count: 1 })
    })

    it('should increment count multiple times', async () => {
      const response1 = await serverFetch('/api/count', { method: 'POST' })
      expect(response1.status).toBe(200)
      const data1: unknown = await response1.json()
      expect(data1).toEqual({ count: 1 })

      const response2 = await serverFetch('/api/count', { method: 'POST' })
      expect(response2.status).toBe(200)
      const data2: unknown = await response2.json()
      expect(data2).toEqual({ count: 2 })

      const response3 = await serverFetch('/api/count', { method: 'POST' })
      expect(response3.status).toBe(200)
      const data3: unknown = await response3.json()
      expect(data3).toEqual({ count: 3 })
    })
  })
}
