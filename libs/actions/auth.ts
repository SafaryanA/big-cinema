'use server'

import type {
	AuthField,
	AuthFieldErrors,
	AuthMessage,
	FormState,
} from '@/@type/auth'
import {
	loginSchema,
	profileSchema,
	recoverySchema,
	registrationSchema,
} from '@/libs/schemas/auth'
import { SESSION_COOKIE, SESSION_MAX_AGE, SIGNED_OUT } from '@/libs/session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { ZodError } from 'zod'

function fromZod(error: ZodError): FormState {
	const fields: AuthFieldErrors = {}

	for (const issue of error.issues) {
		const field = issue.path[0] as AuthField | undefined

		if (field && !fields[field]) fields[field] = issue.message as AuthMessage
	}

	return { error: 'errorCheckFields', success: null, fields }
}

const noBackend: FormState = {
	error: 'errorNoBackend',
	success: null,
	fields: {},
}

export async function loginAction(values: unknown): Promise<FormState> {
	const parsed = loginSchema.safeParse(values)

	if (!parsed.success) return fromZod(parsed.error)

	;(await cookies()).delete(SESSION_COOKIE)

	redirect('/')
}

export async function registerAction(values: unknown): Promise<FormState> {
	const parsed = registrationSchema.safeParse(values)

	if (!parsed.success) return fromZod(parsed.error)

	return noBackend
}

export async function recoverAction(values: unknown): Promise<FormState> {
	const parsed = recoverySchema.safeParse(values)

	if (!parsed.success) return fromZod(parsed.error)

	return noBackend
}

export async function profileAction(values: unknown): Promise<FormState> {
	const parsed = profileSchema.safeParse(values)

	if (!parsed.success) return fromZod(parsed.error)

	return noBackend
}

export async function logoutAction(): Promise<void> {
	;(await cookies()).set(SESSION_COOKIE, SIGNED_OUT, {
		path: '/',
		maxAge: SESSION_MAX_AGE,
		sameSite: 'lax',
	})

	redirect('/')
}
