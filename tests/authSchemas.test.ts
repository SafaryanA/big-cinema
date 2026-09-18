import {
	MIN_LOGIN,
	MIN_PASSWORD,
	loginSchema,
	profileSchema,
	recoverySchema,
	registrationSchema,
} from '@/libs/schemas/auth'
import { describe, expect, it } from 'vitest'

function errors(result: { success: boolean; error?: { issues: unknown[] } }) {
	if (result.success) return {}

	const out: Record<string, string> = {}

	for (const issue of (result.error?.issues ?? []) as {
		path: (string | number)[]
		message: string
	}[]) {
		const field = String(issue.path[0])

		if (!(field in out)) out[field] = issue.message
	}

	return out
}

const GOOD_PASSWORD = 'Qwertyuiopasdfghjk@1'

describe('вход', () => {
	it('пустые поля — обязательны оба', () => {
		expect(errors(loginSchema.safeParse({ login: '', password: '' }))).toEqual({
			login: 'errorRequired',
			password: 'errorRequired',
		})
	})

	it('пробелы не считаются заполнением', () => {
		expect(
			errors(loginSchema.safeParse({ login: '   ', password: '  ' })),
		).toEqual({ login: 'errorRequired', password: 'errorRequired' })
	})

	it('пароль при входе проверяется по тем же правилам', () => {
		expect(
			errors(loginSchema.safeParse({ login: 'demo', password: 'x' })).password,
		).toBe('errorPasswordShort')
	})

	it('верный пароль при входе принимается', () => {
		expect(
			loginSchema.safeParse({ login: 'demo', password: GOOD_PASSWORD }).success,
		).toBe(true)
	})

	it('галочка чужого компьютера необязательна', () => {
		expect(
			loginSchema.safeParse({
				login: 'demo',
				password: GOOD_PASSWORD,
				elsesComputer: true,
			}).success,
		).toBe(true)
	})
})

describe('регистрация', () => {
	const valid = {
		login: 'arturchik',
		password: GOOD_PASSWORD,
		confirmPassword: GOOD_PASSWORD,
		email: 'artur@example.com',
		acceptTerms: true,
	}

	it('годные данные проходят', () => {
		expect(registrationSchema.safeParse(valid).success).toBe(true)
	})

	it('пустая форма — сообщение у каждого поля', () => {
		const got = errors(
			registrationSchema.safeParse({
				login: '',
				password: '',
				confirmPassword: '',
				email: '',
				acceptTerms: false,
			}),
		)

		expect(got).toEqual({
			login: 'errorRequired',
			password: 'errorRequired',
			confirmPassword: 'errorRequired',
			email: 'errorRequired',
			acceptTerms: 'errorTerms',
		})
	})

	it('короткий логин', () => {
		expect(
			errors(registrationSchema.safeParse({ ...valid, login: 'ab' })).login,
		).toBe('errorLoginShort')
	})

	it('пароль короче нормы', () => {
		const short = 'Qw@1'

		expect(
			errors(
				registrationSchema.safeParse({
					...valid,
					password: short,
					confirmPassword: short,
				}),
			).password,
		).toBe('errorPasswordShort')
	})

	it('пароль без заглавной буквы', () => {
		const p = GOOD_PASSWORD.toLowerCase()

		expect(
			errors(
				registrationSchema.safeParse({
					...valid,
					password: p,
					confirmPassword: p,
				}),
			).password,
		).toBe('errorPasswordUpper')
	})

	it('пароль без строчной буквы', () => {
		const p = GOOD_PASSWORD.toUpperCase()

		expect(
			errors(
				registrationSchema.safeParse({
					...valid,
					password: p,
					confirmPassword: p,
				}),
			).password,
		).toBe('errorPasswordLower')
	})

	it('пароль без цифры', () => {
		const p = 'Qwertyuiopasdfghjk@'

		expect(
			errors(
				registrationSchema.safeParse({
					...valid,
					password: p,
					confirmPassword: p,
				}),
			).password,
		).toBe('errorPasswordDigit')
	})

	it('пароль без символа', () => {
		const p = 'Qwertyuiopasdfghjkl1'

		expect(
			errors(
				registrationSchema.safeParse({
					...valid,
					password: p,
					confirmPassword: p,
				}),
			).password,
		).toBe('errorPasswordSymbol')
	})

	it('пароли не совпали — сообщение у поля подтверждения', () => {
		const got = errors(
			registrationSchema.safeParse({
				...valid,
				confirmPassword: GOOD_PASSWORD + '2',
			}),
		)

		expect(got.confirmPassword).toBe('errorPasswordMismatch')
		expect(got.password).toBeUndefined()
	})

	it('негодная почта', () => {
		for (const email of ['нет', 'a@b', 'a b@c.de', '@b.cd', 'a@.cd']) {
			expect(
				errors(registrationSchema.safeParse({ ...valid, email })).email,
			).toBe('errorEmailFormat')
		}
	})

	it('заграничная почта проходит', () => {
		for (const email of ['artur@mail.ru', 'a.b+c@sub.domain.co.uk']) {
			expect(registrationSchema.safeParse({ ...valid, email }).success).toBe(
				true,
			)
		}
	})

	it('без согласия с условиями не пройти', () => {
		expect(
			errors(registrationSchema.safeParse({ ...valid, acceptTerms: false }))
				.acceptTerms,
		).toBe('errorTerms')
	})

	it('пароль ровно минимальной длины годится', () => {
		const p = 'A@1' + 'b'.repeat(MIN_PASSWORD - 3)

		expect(p).toHaveLength(MIN_PASSWORD)
		expect(
			registrationSchema.safeParse({
				...valid,
				password: p,
				confirmPassword: p,
			}).success,
		).toBe(true)
	})

	it('логин ровно минимальной длины годится', () => {
		expect(
			registrationSchema.safeParse({ ...valid, login: 'a'.repeat(MIN_LOGIN) })
				.success,
		).toBe(true)
	})
})

describe('восстановление пароля', () => {
	it('годные данные проходят', () => {
		expect(
			recoverySchema.safeParse({
				login: 'demo',
				password: GOOD_PASSWORD,
				confirmPassword: GOOD_PASSWORD,
			}).success,
		).toBe(true)
	})

	it('логин проверяется только на заполненность', () => {
		expect(
			recoverySchema.safeParse({
				login: 'ab',
				password: GOOD_PASSWORD,
				confirmPassword: GOOD_PASSWORD,
			}).success,
		).toBe(true)
	})

	it('новый пароль проходит все три правила', () => {
		expect(
			errors(
				recoverySchema.safeParse({
					login: 'demo',
					password: 'коротко',
					confirmPassword: 'коротко',
				}),
			).password,
		).toBe('errorPasswordShort')
	})
})

describe('профиль', () => {
	const valid = {
		name: 'Артур',
		login: 'arturchik',
		email: 'artur@example.com',
		password: '',
		confirmPassword: '',
	}

	it('пустой пароль значит «оставить прежний»', () => {
		expect(profileSchema.safeParse(valid).success).toBe(true)
	})

	it('короткое имя не проходит', () => {
		expect(errors(profileSchema.safeParse({ ...valid, name: 'А' })).name).toBe(
			'errorNameShort',
		)
	})

	it('новый пароль проверяется по тем же правилам', () => {
		expect(
			errors(
				profileSchema.safeParse({
					...valid,
					password: 'корот',
					confirmPassword: 'корот',
				}),
			).password,
		).toBe('errorPasswordShort')
	})

	it('новый пароль должен совпасть с подтверждением', () => {
		expect(
			errors(
				profileSchema.safeParse({
					...valid,
					password: GOOD_PASSWORD,
					confirmPassword: GOOD_PASSWORD + '2',
				}),
			).confirmPassword,
		).toBe('errorPasswordMismatch')
	})
})
