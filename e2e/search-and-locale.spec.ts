import { expect, test } from '@playwright/test'

const cards = (page: import('@playwright/test').Page) =>
	page.locator('[class*="CardItemWrapper"]')

test.describe('поиск', () => {
	test('после паузы в наборе уводит на свою страницу с карточками', async ({
		page,
	}) => {
		await page.goto('/ru')
		await page.locator('#search').fill('ни')

		await page.waitForURL(/\/search\?q=/, { timeout: 15_000 })

		await expect(cards(page).first()).toBeVisible()
		expect(await cards(page).count()).toBeGreaterThan(0)
	})

	test('выпадающего списка под полем нет', async ({ page }) => {
		await page.goto('/ru')
		await page.locator('#search').fill('ни')
		await page.waitForURL(/\/search\?q=/, { timeout: 15_000 })

		await expect(page.locator('[class*="searchResults"]')).toHaveCount(0)
	})

	test('Enter уводит сразу', async ({ page }) => {
		await page.goto('/ru')
		await page.locator('#search').fill('ар')
		await page.locator('#search').press('Enter')

		await expect(page).toHaveURL(/\/search\?q=/, { timeout: 5_000 })
	})

	test('пустой и короткий запрос объясняются человеку', async ({ page }) => {
		for (const q of ['', 'а']) {
			await page.goto(`/ru/search?q=${q}`)

			await expect(page.locator('.search-note')).toBeVisible()
			await expect(cards(page)).toHaveCount(0)
		}
	})

	test('на бессмыслицу — «ничего не нашлось»', async ({ page }) => {
		await page.goto('/ru/search?q=zzzzzzzz')

		await expect(page.locator('.search-note')).toBeVisible()
		await expect(cards(page)).toHaveCount(0)
	})

	test('очистка поля возвращает туда, откуда пришли', async ({ page }) => {
		await page.goto('/ru/blade-of-dawn')

		const origin = page.url()

		await page.locator('#search').fill('ар')
		await page.waitForURL(/\/search\?q=/, { timeout: 15_000 })

		await page.locator('#search').fill('')
		await page.waitForURL(origin, { timeout: 15_000 })

		expect(page.url()).toBe(origin)
	})

	test('уход по ссылке сбрасывает поле и не утягивает обратно в поиск', async ({
		page,
	}) => {
		await page.goto('/ru')
		await page.locator('#search').fill('ни')
		await page.waitForURL(/\/search\?q=/, { timeout: 15_000 })

		await page.locator('header a[href="/ru"]').first().click()
		await page.waitForTimeout(4_000)

		expect(page.url()).toMatch(/\/ru$/)
		await expect(page.locator('#search')).toHaveValue('')
	})
})

test.describe('смена языка', () => {
	const switchLocale = async (page: import('@playwright/test').Page) => {
		await page.locator('.btn-lang button').click()
		await page.locator('.btn-lang .dropdown-items a').first().click()
	}

	test('сохраняет строку запроса поиска', async ({ page }) => {
		await page.goto('/ru/search?q=ни')
		await switchLocale(page)

		await expect(page).toHaveURL(/\/en\/search\?q=/, { timeout: 15_000 })
		await expect(cards(page).first()).toBeVisible()
	})

	test('сохраняет параметр категории', async ({ page }) => {
		await page.goto('/ru/fantasy?type=genres')
		await switchLocale(page)

		await expect(page).toHaveURL(/\/en\/fantasy\?type=genres/, {
			timeout: 15_000,
		})
	})

	test('на обычной странице просто меняет язык', async ({ page }) => {
		await page.goto('/ru')
		await switchLocale(page)

		await expect(page).toHaveURL(/\/en$/, { timeout: 15_000 })
	})
})
