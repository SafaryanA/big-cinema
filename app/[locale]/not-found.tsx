import TitlePage from '@/components/ui/titlePage'
import { Link } from '@/i18n/routing'
import { createPageMetadata } from '@/libs/pageMetadata'
import { getTranslations } from 'next-intl/server'
import { NOTFOUND } from './metadata'

export const generateMetadata = createPageMetadata(NOTFOUND, '')

export default async function NotFound() {
	const t = await getTranslations('NotFound')

	return (
		<div className='not-found-page'>
			<div className='not-found-wrapper'>
				<div className='not-found-inner'>
					<TitlePage title={t('mainText')} />
					<Link href='/' className='not-found-redirect main-btn'>
						{t('buttonRedirect')}
					</Link>
				</div>
			</div>
		</div>
	)
}
