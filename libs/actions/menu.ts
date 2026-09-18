'use server'

import { routing } from '@/i18n/routing'
import type { MenuData } from '@/@type/catalog'
import { getMenuData } from '@/libs/menuData'
import { hasLocale } from 'next-intl'

export async function loadMenuData(locale: unknown): Promise<MenuData> {
	const safe = hasLocale(routing.locales, locale)
		? locale
		: routing.defaultLocale

	return getMenuData(safe)
}
