import { initLocale } from '@/libs/locale'
import FilmsFeed from '@/components/ui/filmsFeed'
import HeroImage from '@/components/ui/heroImage'
import TitlePage from '@/components/ui/titlePage'
import { PAGE_SIZE, getFilms } from '@/libs/catalog'
import { Link } from '@/i18n/routing'
import { createPageMetadata } from '@/libs/pageMetadata'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { CONTENT } from './metadata'

export const generateMetadata = createPageMetadata(CONTENT, '')

export default async function Home({ params }: PageProps<'/[locale]'>) {
	const locale = initLocale((await params).locale)

	const t = await getTranslations('HomePage')

	const { cards, hasMore } = getFilms(0, PAGE_SIZE, locale)
	return (
		<div>
			<div className='startBlock '>
				<div className='wrapper-central-button'>
					<Link
						href='/subscription'
						className='central-button central-button_text'
					>
						{' '}
						{t('Subscription')}{' '}
					</Link>
				</div>
				<HeroImage alt={t('HomePageTitle')} />
				<div className='wrapper-bottom-line'>
					<Image
						src='/icons/line.svg'
						width={3096}
						height={60}
						alt=''
						priority
						className='bottom-line-icon'
					/>
				</div>
			</div>
			<main className='main-page'>
				<TitlePage title={t('HomePageTitle')} />
				<FilmsFeed initial={cards} initialHasMore={hasMore} locale={locale} />
			</main>
		</div>
	)
}
