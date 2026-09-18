'use server'

import { routing } from '@/i18n/routing'
import type { CatalogFilter, CatalogSlice } from '@/@type/catalog'
import { MAX_PAGES, PAGE_SIZE, getFilms } from '@/libs/catalog'
import { isCategoryField } from '@/libs/filmInfo'
import { hasLocale } from 'next-intl'

const MAX_LIMIT = PAGE_SIZE * MAX_PAGES

function toWholeNumber(value: unknown, fallback: number): number {
	return typeof value === 'number' && Number.isInteger(value) && value >= 0
		? value
		: fallback
}

function cleanFilter(filter: unknown): CatalogFilter | null {
	if (!filter || typeof filter !== 'object') return null

	const { type, value } = filter as Record<string, unknown>

	if (!isCategoryField(type) || typeof value !== 'string') return null

	return { type, value }
}

export async function loadFilms(
	offset: unknown,
	limit: unknown,
	locale: unknown,
	filter: unknown,
): Promise<CatalogSlice> {
	const safeLocale = hasLocale(routing.locales, locale)
		? locale
		: routing.defaultLocale

	const safeLimit = Math.min(
		Math.max(toWholeNumber(limit, PAGE_SIZE), 1),
		MAX_LIMIT,
	)

	return getFilms(
		toWholeNumber(offset, 0),
		safeLimit,
		safeLocale,
		cleanFilter(filter),
	)
}
