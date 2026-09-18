'use client'

import type { ErrorPageProps } from '@/@type/ui'
import TitlePage from '@/components/ui/titlePage'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
	const t = useTranslations('ErrorPage')

	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<div className='not-found-page'>
			<div className='not-found-wrapper'>
				<div className='not-found-inner'>
					<TitlePage title={t('title')} />
					<p className='error-text'>{t('text')}</p>
					{error.digest && <p className='error-digest'>{error.digest}</p>}
					<div className='error-actions'>
						<button
							type='button'
							className='main-btn'
							onClick={() => unstable_retry()}
						>
							{t('retry')}
						</button>
						<Link href='/' className='main-btn'>
							{t('home')}
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
