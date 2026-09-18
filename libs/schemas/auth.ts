import { z } from 'zod'

export const MIN_NAME = 2
export const MIN_LOGIN = 3
export const MIN_PASSWORD = 10

const SYMBOL = /[^\p{L}\p{N}]/u
const UPPER = /\p{Lu}/u
const LOWER = /\p{Ll}/u
const DIGIT = /\p{Nd}/u
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const required = z.string().trim().min(1, 'errorRequired')

const loginField = required.min(MIN_LOGIN, 'errorLoginShort')
const nameField = required.min(MIN_NAME, 'errorNameShort')
const emailField = required.regex(EMAIL, 'errorEmailFormat')

const passwordField = required
	.min(MIN_PASSWORD, 'errorPasswordShort')
	.regex(UPPER, 'errorPasswordUpper')
	.regex(LOWER, 'errorPasswordLower')
	.regex(DIGIT, 'errorPasswordDigit')
	.regex(SYMBOL, 'errorPasswordSymbol')

const samePassword = <
	T extends { password?: string; confirmPassword?: string },
>(
	values: T,
	ctx: z.RefinementCtx,
) => {
	if (values.password && values.password !== values.confirmPassword) {
		ctx.addIssue({
			code: 'custom',
			message: 'errorPasswordMismatch',
			path: ['confirmPassword'],
		})
	}
}

export const loginSchema = z.object({
	login: required,
	password: passwordField,
	elsesComputer: z.boolean().optional(),
})

export const registrationSchema = z
	.object({
		login: loginField,
		password: passwordField,
		confirmPassword: required,
		email: emailField,
		acceptTerms: z.boolean().refine(value => value, 'errorTerms'),
	})
	.superRefine(samePassword)

export const recoverySchema = z
	.object({
		login: required,
		password: passwordField,
		confirmPassword: required,
	})
	.superRefine(samePassword)

export const profileSchema = z
	.object({
		name: nameField,
		login: loginField,
		email: emailField,
		password: z.string().optional(),
		confirmPassword: z.string().optional(),
	})
	.superRefine((values, ctx) => {
		if (!values.password) return

		const check = passwordField.safeParse(values.password)

		if (!check.success) {
			ctx.addIssue({
				code: 'custom',
				message: check.error.issues[0].message,
				path: ['password'],
			})
		}

		samePassword(values, ctx)
	})

export type LoginValues = z.infer<typeof loginSchema>
export type RegistrationValues = z.infer<typeof registrationSchema>
export type RecoveryValues = z.infer<typeof recoverySchema>
export type ProfileValues = z.infer<typeof profileSchema>
