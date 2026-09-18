import { routing } from '@/i18n/routing'
import type { Locale } from 'next-intl'
import { hasLocale } from 'next-intl'

export const countryHeaders = [
	'x-vercel-ip-country',
	'cf-ipcountry',
	'cloudfront-viewer-country',
] as const

const localeByCountry: Record<string, Locale | undefined> = {
	AM: 'hy',
	RU: 'ru',
	BY: 'ru',
	KZ: 'ru',
	KG: 'ru',
}

export function getCountry(headers: Headers): string | null {
	for (const name of countryHeaders) {
		const value = headers.get(name)

		if (value && value !== 'XX' && value !== 'T1') {
			return value.toUpperCase()
		}
	}

	return null
}

export function getLocaleByCountry(headers: Headers): Locale | null {
	const country = getCountry(headers)

	return country ? (localeByCountry[country] ?? null) : null
}

export function headerNamesOurLocale(headers: Headers): boolean {
	const header = headers.get('accept-language')

	if (!header) return false

	return header.split(',').some(part => {
		const tag = part.split(';')[0].trim().split('-')[0].toLowerCase()

		return hasLocale(routing.locales, tag)
	})
}
