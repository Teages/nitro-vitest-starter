import { serverFetch } from 'nitro/app'
import { describe, expect, it } from 'vitest'

// yes we have another test file for count
// the test here is isolated from the one in count.post.ts,
// because vitest create a isolated environment for each test file
describe('another post /api/count', () => {
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
