import type { CardView, Item, SliderItem, card } from '@/@type/item'
import type { CatalogFilter, CatalogSlice } from '@/@type/catalog'
import { routing } from '@/i18n/routing'
import { film } from '@/fakeDb'
import { MIN_QUERY } from '@/libs/api'
import type { Locale } from 'next-intl'

export const PAGE_SIZE = 30

export const AUTO_PAGES = 10

export const MAX_PAGES = 20

export function selectFilms(filter: CatalogFilter | null): card[] {
	if (!filter) return film

	const { type, value } = filter

	return film.filter(f => {
		if (type === 'year') return String(f.year) === value

		return f[type].some(entry => entry.url === value)
	})
}

export function getFilmBySlug(slug: string): card | null {
	return film.find(item => item.slug === slug) ?? null
}

export function getFilmSlugs(): string[] {
	return [...new Set(film.map(item => item.slug))]
}

export function toSliderView(
	item: Pick<CardView, 'id' | 'imgSrc' | 'slug' | 'title'>,
): SliderItem {
	return {
		id: item.id,
		imgSrc: item.imgSrc,
		slug: item.slug,
		title: item.title,
	}
}

export function getSliderItems(locale: Locale): SliderItem[] {
	return film.map(item => toSliderView(toCardView(item, locale)))
}

export function toCardView(item: Item, locale: Locale): CardView {
	return {
		id: item.id,
		slug: item.slug,
		year: item.year,
		rating: item.rating,
		title: item.title[locale],
		imgSrc: item.imgSrc,
		type: item.type,
		subscribe: item.subscribe,
	}
}
export function getFilms(
	offset: number,
	limit: number,
	locale: Locale,
	filter: CatalogFilter | null = null,
): CatalogSlice {
	const all = selectFilms(filter)
	const slice = all.slice(offset, offset + limit)

	return {
		cards: slice.map(item => toCardView(item, locale)),
		hasMore: offset + slice.length < all.length,
		total: all.length,
	}
}
export const SIMILAR_LIMIT = 10
export function getSimilar(
	item: Pick<card, 'id' | 'genres'>,
	locale: Locale,
	limit: number = SIMILAR_LIMIT,
): CardView[] {
	const own = new Set(item.genres.map(genre => genre.url))

	return film
		.filter(other => other.id !== item.id)
		.map(other => ({
			other,
			common: other.genres.filter(genre => own.has(genre.url)).length,
		}))
		.filter(pair => pair.common > 0)
		.sort((a, b) => b.common - a.common || b.other.rating - a.other.rating)
		.slice(0, limit)
		.map(pair => toCardView(pair.other, locale))
}

export const SEARCH_LIMIT = 60

export function findFilms(
	query: string,
	locale: Locale,
	limit: number = SEARCH_LIMIT,
): CardView[] {
	const text = query.trim().toLowerCase()

	if (text.length < MIN_QUERY) return []

	return film
		.filter(item =>
			routing.locales.some(code =>
				item.title[code].toLowerCase().includes(text),
			),
		)
		.slice(0, limit)
		.map(item => toCardView(item, locale))
}
