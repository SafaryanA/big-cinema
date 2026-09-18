'use client'

import type { FormStatusProps } from '@/@type/auth'
import { useTranslations } from 'next-intl'

export default function FormStatus({ message, pending }: FormStatusProps) {
	const t = useTranslations('LoginBox')

	return (
		<p className='form-status' role='status' aria-live='polite'>
			{!pending && message ? t(message) : ''}
		</p>
	)
}
