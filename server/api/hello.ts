import { defineHandler } from 'nitro'

export default defineHandler(() => {
  return { message: 'Hello Nitro!' }
})

// I love in-source tests! 😍
// https://vitest.dev/guide/in-source.html
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('GET /api/hello', async () => {
    const { serverFetch } = await import('nitro/app')

    it('should return a greeting message', async () => {
      const response = await serverFetch('/api/hello')
      expect(response.status).toBe(200)

      const data: unknown = await response.json()
      expect(data).toEqual({ message: 'Hello Nitro!' })
    })
  })
}
