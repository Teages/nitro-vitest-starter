import { fetch } from 'nitro'

export default {
  async fetch() {
    // Fetch initial count from server API
    const response = await fetch('/api/count')
    const data = (await response.json()) as { count: number }
    return `Count is ${data.count}`
  },
}
