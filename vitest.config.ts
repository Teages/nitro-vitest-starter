import { defineConfig, mergeConfig } from 'vitest/config'
import { nitroTestPlugin } from './test/plugin'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  plugins: [
    nitroTestPlugin(),
  ],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'server',
          include: [
            'test/server/**/*.test.ts',
          ],
          includeSource: [
            'server/**/*.ts',
          ],
          environment: './test/env.ts',
        },
      },
      {
        extends: true,
        test: {
          name: 'app',
          include: [
            'test/app/**/*.test.ts',
          ],
          includeSource: [
            'app/**/*.ts',
          ],
        },
      },
    ],
  },
}))
