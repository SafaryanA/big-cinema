import type { CategoryPageProps } from '@/@type/catalog'
import FilmsFeed from '@/components/ui/filmsFeed'
import TitlePage from '@/components/ui/titlePage'
import { PAGE_SIZE, getFilms, selectFilms } from '@/libs/catalog'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

export default async function CategoryPage({
	type,
	value,
	locale,
}: CategoryPageProps) {
	const t = await getTranslations('FilmPage')

	const filter = { type, value }

	const items = selectFilms(filter)

	if (items.length === 0) notFound()

	const { cards, hasMore } = getFilms(0, PAGE_SIZE, locale, filter)

	function label(): string {
		if (type === 'year') return value

		const found = items[0][type].find(entry => entry.url === value)

		return found ? found[locale] : value
	}

	return (
		<>
			<TitlePage
				title={`${t(type)}: ${label()}`}
				className='title container_height'
			/>
			<FilmsFeed
				initial={cards}
				initialHasMore={hasMore}
				locale={locale}
				filter={filter}
			/>
		</>
	)
}
