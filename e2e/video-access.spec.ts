import { expect, test } from '@playwright/test'

const SERIES = '/ru/aurora-chronicles'
const FILM = '/ru/blade-of-dawn'

async function player(page: import('@playwright/test').Page) {
	return page.evaluate(() => {
		const frame = document.querySelector('iframe[src*="youtube"]')

		if (frame)
			return (
				'youtube:' +
				frame.getAttribute('src')!.split('/embed/')[1].split('?')[0]
			)

		const video = document.querySelector('video')

		if (!video) return 'нет плеера'

		return 'файл:' + (video.querySelector('source')?.getAttribute('src') ?? '—')
	})
}

test.describe('гость', () => {
	test.use({ storageState: { cookies: [], origins: [] } })

	test('имя видеофайла не попадает в разметку', async ({ page, context }) => {
		await context.addCookies([
			{ name: 'SESSION', value: 'out', url: 'http://localhost:3100' },
		])
		await page.goto(FILM)

		const html = await page.content()

		expect(html).not.toContain('hf_20260621_202529')
	})

	test('трейлер смотреть можно, заслонка кадр не закрывает', async ({
		page,
		context,
	}) => {
		await context.addCookies([
			{ name: 'SESSION', value: 'out', url: 'http://localhost:3100' },
		])
		await page.goto(SERIES)

		await expect(page.locator('video, iframe[src*="youtube"]')).toBeVisible()

		const overlay = page.locator('.overlay-error-video')

		if (await overlay.count()) {
			await expect(overlay).toHaveClass(/overlay-error-video_bar/)
			await expect(overlay).toHaveCSS('pointer-events', 'none')
		}
	})

	test('профиль недоступен, уводит на вход', async ({ page, context }) => {
		await context.addCookies([
			{ name: 'SESSION', value: 'out', url: 'http://localhost:3100' },
		])
		await page.goto('/ru/profile')

		await expect(page).toHaveURL(/\/login/)
	})
})

test.describe('вошедший', () => {
	test('получает сам фильм, а не трейлер', async ({ page }) => {
		await page.goto(FILM)

		expect(await player(page)).toContain('hf_20260621_202529')
	})

	test('переключение трейлера идёт без обращения к серверу', async ({
		page,
	}) => {
		await page.goto(FILM)

		const before = await player(page)
		const navigations: string[] = []

		page.on('framenavigated', frame => {
			if (frame === page.mainFrame()) navigations.push(frame.url())
		})

		await page.locator('input.toggle-switch').click()
		await page.waitForTimeout(800)

		expect(await player(page)).not.toBe(before)
		expect(navigations).toHaveLength(0)
	})

	test('смена серии меняет видео', async ({ page }) => {
		await page.goto(SERIES)

		const pickers = page.locator('[class*="playerPickers"] .dropdown-root')

		await expect(pickers).toHaveCount(2)

		const before = await player(page)
		const series = pickers.nth(1)

		await series.locator('button').first().click()

		const items = series.locator('.dropdown-items button, .dropdown-items a')

		await items.nth(1).click()
		await page.waitForTimeout(800)

		expect(await player(page)).not.toBe(before)
	})

	test('селекторы стоят вне плеера и не закрывают управление', async ({
		page,
	}) => {
		await page.goto(SERIES)

		const inside = await page.evaluate(() => {
			const pick = document.querySelector('[class*="playerPickers"]')
			const inner = document.querySelector('[class*="filmInner"]')

			return pick && inner ? inner.contains(pick) : null
		})

		expect(inside).toBe(false)
	})
})
