import CategoryPage from '@/components/shared/categoryPage'
import FilmPage from '@/components/shared/filmPage'
import { getFilmBySlug } from '@/libs/catalog'
import { isCategoryField } from '@/libs/filmInfo'
import { getMetadataFromDB } from '@/libs/metadataLib'
import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { CONTENT, FILMCONTENT } from './metadata'

export async function generateMetadata({
	params,
	searchParams,
}: PageProps<'/[locale]/[slug]'>): Promise<Metadata> {
	const { locale, slug } = await params
	const { type } = await searchParams

	return isCategoryField(type)
		? getMetadataFromDB(locale, CONTENT, `/${slug}`)
		: getMetadataFromDB(locale, FILMCONTENT, `/${slug}`)
}

export default async function Page({
	params,
	searchParams,
}: PageProps<'/[locale]/[slug]'>) {
	const { slug } = await params
	const { type, trailer } = await searchParams
	const locale = await getLocale()

	if (isCategoryField(type)) {
		return (
			<CategoryPage
				type={type}
				value={decodeURIComponent(slug)}
				locale={locale}
			/>
		)
	}

	const item = getFilmBySlug(slug)
	if (!item) notFound()

	return <FilmPage item={item} locale={locale} showTrailer={trailer === '1'} />
}
