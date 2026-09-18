import { getFilmSlugs } from '@/libs/catalog'
import { filmHref } from '@/libs/filmHref'
import { SITE_URL } from '@/libs/metadataLib'
import { routing } from '@/i18n/routing'
import type { MetadataRoute } from 'next'


const STATIC_PAGES = ['subscription', 'privacy-policy', 'user-agreement']

function absolute(locale: string, path: string): string {
	return new URL(`/${locale}${path}`, SITE_URL).toString()
}

function entry(path: string, priority: number): MetadataRoute.Sitemap[number] {
	return {
		url: absolute(routing.defaultLocale, path),
		lastModified: new Date(),
		changeFrequency: 'weekly',
		priority,
		alternates: {
			languages: {
				...Object.fromEntries(
					routing.locales.map(locale => [locale, absolute(locale, path)]),
				),
				'x-default': new URL(path || '/', SITE_URL).toString(),
			},
		},
	}
}

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		entry('', 1),
		...STATIC_PAGES.map(page => entry(`/${page}`, 0.5)),
		...getFilmSlugs().map(slug => entry(filmHref(slug), 0.8)),
	]
}
