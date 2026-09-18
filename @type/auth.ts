import type { ReactNode } from 'react'
import type { Plan } from './catalog'



export interface CurrentUser {
	name: string
	login: string
	email: string
	plan: Plan
	subscribe: boolean
}

export type AuthMessage =
	| 'errorEmpty'
	| 'errorCheckFields'
	| 'errorPasswordMismatch'
	| 'errorTerms'
	| 'errorNoBackend'
	| 'errorRequired'
	| 'errorLoginShort'
	| 'errorPasswordShort'
	| 'errorEmailFormat'
	| 'errorNameShort'
	| 'errorPasswordUpper'
	| 'errorPasswordLower'
	| 'errorPasswordDigit'
	| 'errorPasswordSymbol'

export type AuthField =
	'name' | 'login' | 'password' | 'confirmPassword' | 'email' | 'acceptTerms'

export interface FormState {
	error: AuthMessage | null
	success: AuthMessage | null
	fields: Partial<Record<AuthField, AuthMessage>>
}


export interface FieldErrorProps {
	field: AuthField
	message?: string
}

export interface FormStatusProps {
	message: AuthMessage | null
	pending: boolean
}

export interface AuthOverlayProps {
	title: string
	closeHref: string
	children: ReactNode
}

export interface LoginBoxProps {
	closeHref?: string
}

export interface RegistrationBoxProps {
	closeHref?: string
}

export interface ForgotPasswordBoxProps {
	closeHref?: string
}

export interface ProfileBoxProps {
	closeHref?: string
	user: Pick<CurrentUser, 'name' | 'login' | 'email' | 'plan'>
}

export type AuthFieldErrors = FormState['fields']

export interface UserAreaProps {
	profileLabel: string
	logoutLabel: string
	loginLabel: string
	className?: string
}
