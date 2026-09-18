import type { itemMenu, Locale } from '@/@type/item'
import type { MenuData, MenuEntry } from '@/@type/catalog'
import { items } from '@/fakeDb'

function forLocale(list: readonly itemMenu[], locale: Locale): MenuEntry[] {
	return list.map(entry => ({ url: entry.url, label: entry[locale] }))
}

export function getMenuData(locale: Locale): MenuData {
	return {
		genres: forLocale(items.genres, locale),
		studios: forLocale(items.studios, locale),
		countries: forLocale(items.countries, locale),
		years: [...items.years].sort((a, b) => b - a),
	}
}
