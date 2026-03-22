import type { UserConfig } from 'vite'
import type { } from 'vitest/config'
import { mergeConfig } from 'vite'
import { nitroTestPlugin } from './plugin'

export function defineConfig(config: UserConfig): UserConfig {
  return mergeConfig(config, {
    plugins: [
      nitroTestPlugin(),
    ],
    test: {
      environment: './test/env.ts',
    },
  })
}
