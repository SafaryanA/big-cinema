'use client'

import type { AuthMessage, FieldErrorProps } from '@/@type/auth'
import { useTranslations } from 'next-intl'

export default function FieldError({ field, message }: FieldErrorProps) {
	const t = useTranslations('LoginBox')

	return (
		<p className='field-error' id={`${field}-error`} role='alert'>
			{message ? t(message as AuthMessage) : ''}
		</p>
	)
}
