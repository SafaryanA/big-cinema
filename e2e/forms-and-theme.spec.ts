import { expect, test } from '@playwright/test'

const messages = (page: import('@playwright/test').Page) =>
	page.locator('.field-error').filter({ hasText: /\S/ })

test.describe('формы', () => {
	test('пустая регистрация показывает сообщение у каждого поля', async ({
		page,
	}) => {
		await page.goto('/ru/registration')
		await page.locator('.btn-registration').click()

		await expect(messages(page)).toHaveCount(5)
	})

	test('введённое не теряется при неудачной отправке', async ({ page }) => {
		await page.goto('/ru/registration')

		await page.locator('#input-login').fill('arturchik')
		await page.locator('#input-email').fill('artur@example.com')
		await page.locator('#input-password').fill('коротко')
		await page.locator('#input-confirm-password').fill('коротко')
		await page.locator('input[type="checkbox"]').check()

		await page.locator('.btn-registration').click()
		await page.waitForTimeout(1_000)

		await expect(page.locator('#input-login')).toHaveValue('arturchik')
		await expect(page.locator('#input-email')).toHaveValue('artur@example.com')
		await expect(page.locator('input[type="checkbox"]')).toBeChecked()
	})

	test('нижняя широкая кнопка отправляет форму, а не уводит на другую страницу', async ({
		page,
	}) => {
		for (const [route, tag] of [
			['/ru/login', 'BUTTON'],
			['/ru/registration', 'BUTTON'],
			['/ru/forgot-password', 'BUTTON'],
		] as const) {
			await page.goto(route)

			const bar = page.locator('.btn-registration')

			await expect(bar).toHaveJSProperty('tagName', tag)
			await expect(bar).toHaveAttribute('type', 'submit')
		}
	})

	test('вход снимает куку выхода и уводит на главную', async ({
		page,
		context,
	}) => {
		await context.addCookies([
			{ name: 'SESSION', value: 'out', url: 'http://localhost:3100' },
		])
		await page.goto('/ru/login')

		await page.locator('#input-login').fill('demo')
		await page.locator('#input-password').fill('Qwertyuiop@1')
		await page.locator('.btn-registration').click()

		await page.waitForURL(/\/ru$/, { timeout: 15_000 })

		const session = (await context.cookies()).find(c => c.name === 'SESSION')

		expect(session?.value).not.toBe('out')
	})

	test('страница восстановления пароля есть на всех языках', async ({
		page,
	}) => {
		for (const locale of ['ru', 'en', 'hy']) {
			const response = await page.goto(`/${locale}/forgot-password`)

			expect(response?.status()).toBe(200)
			await expect(page.locator('#input-confirm-password')).toBeVisible()
		}
	})
})

test.describe('тема', () => {
	test('переключается и переживает перезагрузку', async ({ page }) => {
		await page.goto('/ru')

		const theme = () =>
			page.evaluate(() => document.documentElement.dataset.theme ?? 'dark')

		const before = await theme()

		await page
			.getByRole('banner')
			.locator('button[class*="themeToggle"]')
			.click()
		await page.waitForTimeout(500)

		const after = await theme()

		expect(after).not.toBe(before)

		await page.reload()
		expect(await theme()).toBe(after)
	})

	test('в консоли нет ошибок при смене языка', async ({ page }) => {
		const errors: string[] = []

		page.on('console', m => {
			if (m.type() === 'error') errors.push(m.text())
		})

		await page.goto('/ru/blade-of-dawn')
		await page.locator('.btn-lang button').click()
		await page.locator('.btn-lang .dropdown-items a').first().click()
		await page.waitForTimeout(3_000)

		expect(errors).toEqual([])
	})
})

test.describe('маршруты', () => {
	test('известные страницы отвечают 200, мусор — 404', async ({ page }) => {
		for (const [url, status] of [
			['/ru', 200],
			['/ru/blade-of-dawn', 200],
			['/ru/search?q=ни', 200],
			['/ru/login', 200],
			['/ru/forgot-password', 200],
			['/ru/subscription', 200],
			['/ru/нет-такой-страницы', 404],
		] as const) {
			const response = await page.goto(url)

			expect(response?.status(), url).toBe(status)
		}
	})

	test('карта сайта без повторов', async ({ request }) => {
		const xml = await (await request.get('/sitemap.xml')).text()
		const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])

		expect(locs.length).toBeGreaterThan(0)
		expect(locs).toHaveLength(new Set(locs).size)
	})
})
