import CardsGrid from '@/components/ui/cardsGrid'
import TitlePage from '@/components/ui/titlePage'
import { MIN_QUERY } from '@/libs/api'
import { findFilms } from '@/libs/catalog'
import { createPageMetadata } from '@/libs/pageMetadata'
import { getLocale, getTranslations } from 'next-intl/server'
import { CONTENT } from './metadata'

export const generateMetadata = createPageMetadata(CONTENT, '/search', {
	robots: { index: false, follow: true },
})

export default async function Search({
	searchParams,
}: PageProps<'/[locale]/search'>) {
	const { q } = await searchParams
	const locale = await getLocale()
	const t = await getTranslations('MainMenu')

	const query = typeof q === 'string' ? q.trim() : ''
	const cards = findFilms(query, locale)

	return (
		<div className='container_height'>
			<TitlePage title={query ? t('SearchTitle', { query }) : t('Search')} />

			{query.length < MIN_QUERY ? (
				<p className='search-note'>{t('SearchShort')}</p>
			) : cards.length === 0 ? (
				<p className='search-note'>{t('SearchEmpty')}</p>
			) : (
				<CardsGrid cards={cards} />
			)}
		</div>
	)
}
