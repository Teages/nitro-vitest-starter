import { mergeConfig } from 'vitest/config'
import { defineConfig } from './test/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    include: [
      'test/server/**/*.test.ts',
    ],
    includeSource: [
      'server/**/*.ts',
    ],
  },
}))
