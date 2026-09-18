import { routing } from '@/i18n/routing'
import { hasLocale } from 'next-intl'
import type { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export function initLocale(locale: string): Locale {
	if (!hasLocale(routing.locales, locale)) notFound()

	setRequestLocale(locale)

	return locale
}
