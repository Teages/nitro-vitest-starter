import { defineEventHandler, defineLazyEventHandler } from 'nitro/h3'

// Stateful is also possible, the tests in different files will be run in isolated environments
// but it would be really dangerous if you use a non-inmemory storage, like a remote database
// I suggest you to use a in-memory storage for testing
export default defineLazyEventHandler(() => {
  let count = 0

  return defineEventHandler(() => {
    count += 1
    return { count }
  })
})

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('post /api/count', async () => {
    const { serverFetch } = await import('nitro/app')

    it('should return the incremented count', async () => {
      const response1 = await serverFetch('/api/count', { method: 'POST' })
      expect(response1.status).toBe(200)

      const data1: unknown = await response1.json()
      expect(data1).toEqual({ count: 1 })

      const response2 = await serverFetch('/api/count', { method: 'POST' })
      expect(response2.status).toBe(200)

      const data2: unknown = await response2.json()
      expect(data2).toEqual({ count: 2 })
    })
  })
}
