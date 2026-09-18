import { defineConfig } from '@playwright/test'

const PORT = 3100
const BASE = `http://localhost:${PORT}`

export default defineConfig({
	testDir: './e2e',
	timeout: 60_000,
	expect: { timeout: 10_000 },
	fullyParallel: false,
	workers: 1,
	reporter: [['list']],
	use: {
		baseURL: BASE,
		channel: 'msedge',
		viewport: { width: 1400, height: 1000 },
		trace: 'retain-on-failure',
	},
	webServer: {
		command: `npm run build && npx next start -p ${PORT}`,
		url: BASE,
		reuseExistingServer: true,
		timeout: 300_000,
	},
})
