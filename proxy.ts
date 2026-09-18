import type { Locale } from 'next-intl'
import { hasLocale } from 'next-intl'
import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import {
	countryHeaders,
	getLocaleByCountry,
	headerNamesOurLocale,
} from './libs/geo'
const handleI18n = createMiddleware(routing)
const localeCookie = 'NEXT_LOCALE'
function hasLocalePrefix(pathname: string): boolean {
	return hasLocale(routing.locales, pathname.split('/')[1])
}
function guessByCountry(request: NextRequest): Locale | null {
	if (hasLocalePrefix(request.nextUrl.pathname)) return null
	if (request.cookies.has(localeCookie)) return null
	if (headerNamesOurLocale(request.headers)) return null
	return getLocaleByCountry(request.headers)
}
export function proxy(request: NextRequest) {
	const guessed = guessByCountry(request)
	if (guessed) request.cookies.set(localeCookie, guessed)
	const response = handleI18n(request)
	if (guessed) {
		response.cookies.set(localeCookie, guessed, {
			path: '/',
			sameSite: 'lax',
		})
	}
	if (!hasLocalePrefix(request.nextUrl.pathname)) {
		response.headers.set(
			'Vary',
			['accept-language', 'cookie', ...countryHeaders].join(', '),
		)
	}
	return response
}
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|_vercel|.*\\..*).*)'],
}
