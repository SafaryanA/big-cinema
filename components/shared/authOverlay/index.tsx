'use client'

import type { AuthOverlayProps } from '@/@type/auth'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect } from 'react'


export default function AuthOverlay({
	title,
	closeHref,
	children,
}: AuthOverlayProps) {
	const t = useTranslations('LoginBox')
	const router = useRouter()

	const close = () => router.push(closeHref)

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close()
		}
		document.addEventListener('keydown', onKeyDown)

		return () => document.removeEventListener('keydown', onKeyDown)
	})

	return (
		<div
			className='login-overlay active'
			role='dialog'
			aria-modal='true'
			aria-label={title}
			onClick={close}
		>
			<div className='login-wrapper' onClick={event => event.stopPropagation()}>
				<div className='login-top-block'>
					<h1 className='login-title'>{title}</h1>
					<button type='button' title={t('close')} onClick={close}>
						<Image src='/icons/close.svg' width={10} height={10} alt='' />
					</button>
				</div>
				{children}
			</div>
		</div>
	)
}
