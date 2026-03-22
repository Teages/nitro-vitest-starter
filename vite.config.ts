import { nitro } from 'nitro/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    nitro(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  define: {
    'import.meta.vitest': 'undefined',
  },
})
