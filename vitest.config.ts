import { defineConfig } from 'vitest/config'
import { nitroTestPlugin } from './test/plugin'

export default defineConfig({
  test: {
    projects: [
      {
        extends: './vite.config.ts',
        plugins: [
          nitroTestPlugin(),
        ],
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
        extends: './vite.config.ts',
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
})
