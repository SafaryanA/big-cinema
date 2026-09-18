import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const stub = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
		alias: [
			{
				find: /^next\/navigation$/,
				replacement: stub('./tests/stubs/nextNavigation.ts'),
			},
		],
	},
	test: {
		include: ['tests/**/*.test.ts'],
		environment: 'node',
		server: { deps: { inline: ['next-intl'] } },
	},
})
