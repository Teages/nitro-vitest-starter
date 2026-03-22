import { defineConfig, mergeConfig } from 'vitest/config'
import { nitroTestPlugin } from './test/plugin.ts'
import viteConfig from './vite.config.ts'

export default mergeConfig(viteConfig, defineConfig({
  plugins: [
    nitroTestPlugin(), // close nitro runner after tests finish
  ],
  test: {
    include: [
      'test/app/**/*.test.ts',
    ],
    includeSource: [
      'app/**/*.ts',
    ],
  },
}))
