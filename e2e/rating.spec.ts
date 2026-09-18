import { expect, test } from '@playwright/test'

const FILM = '/ru/aurora-chronicles'

const stars = (page: import('@playwright/test').Page) =>
	page.locator('[class*="starButton"]')

const shown = (page: import('@playwright/test').Page) =>
	page.locator('[class*="filmRating"] span').last()

const note = (page: import('@playwright/test').Page) =>
	page.locator('[class*="ratingNote"]')

test.describe('оценка фильма', () => {
	test('вошедший ставит свою оценку, и она заменяет общую', async ({
		page,
	}) => {
		await page.goto(FILM)

		const common = await shown(page).textContent()

		await expect(stars(page)).toHaveCount(10)

		await stars(page).nth(8).click()

		await expect(shown(page)).toHaveText('9')
		expect(await shown(page).textContent()).not.toBe(common)
		await expect(note(page)).toContainText(common!)
	})

	test('оценка переживает перезагрузку', async ({ page }) => {
		await page.goto(FILM)
		await stars(page).nth(6).click()
		await expect(shown(page)).toHaveText('7')

		await page.reload()

		await expect(shown(page)).toHaveText('7')
	})

	test('оценку можно переставить', async ({ page }) => {
		await page.goto(FILM)

		await stars(page).nth(2).click()
		await expect(shown(page)).toHaveText('3')

		await stars(page).nth(9).click()
		await expect(shown(page)).toHaveText('10')
	})

	test('оценки разных фильмов не путаются', async ({ page }) => {
		await page.goto(FILM)
		await stars(page).nth(4).click()
		await expect(shown(page)).toHaveText('5')

		await page.goto('/ru/iron-phoenix')
		await stars(page).nth(1).click()
		await expect(shown(page)).toHaveText('2')

		await page.goto(FILM)
		await expect(shown(page)).toHaveText('5')
	})

	test('каждая звезда подписана для скринридера', async ({ page }) => {
		await page.goto(FILM)

		await expect(stars(page).nth(0)).toHaveAttribute('aria-label', /1/)
		await expect(stars(page).nth(9)).toHaveAttribute('aria-label', /10/)
	})
})

test.describe('оценка у гостя', () => {
	test('звёзды не нажимаются, вместо приглашения — ссылка на вход', async ({
		page,
		context,
	}) => {
		await context.addCookies([
			{ name: 'SESSION', value: 'out', url: 'http://localhost:3100' },
		])
		await page.goto(FILM)

		await expect(stars(page)).toHaveCount(0)
		await expect(note(page).locator('a')).toHaveAttribute('href', /\/login/)
	})

	test('общая оценка гостю видна', async ({ page, context }) => {
		await context.addCookies([
			{ name: 'SESSION', value: 'out', url: 'http://localhost:3100' },
		])
		await page.goto(FILM)

		await expect(shown(page)).toHaveText(/\d/)
	})
})
