'use client'
import type { OverlayErrorVideoProps } from '@/@type/filmPage'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function OverlayErrorVideo({
	reason,
	blocking = true,
}: OverlayErrorVideoProps) {
	const t = useTranslations('Error')

	const className = `overlay-error-video${blocking ? '' : ' overlay-error-video_bar'}`

	if (reason === 'released') {
		return (
			<div className={className}>
				<h2 className='error-video-title'>{t('released')}</h2>
			</div>
		)
	}

	const href = reason === 'registration' ? '/registration' : '/subscription'
	const btnKey = reason === 'registration' ? 'registrationBtn' : 'subscribeBtn'

	return (
		<div className={className}>
			<h2 className='error-video-title'>{t(reason)}</h2>
			<Link className=' main-btn' href={href}>
				{t(btnKey)}
			</Link>
		</div>
	)
}
