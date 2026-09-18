import {
	type PageContent,
	type SiteLocale,
	OG_LOCALES,
} from '@/@type/metadataLib'
import type { Metadata } from 'next'

export const SITE_URL = new URL('https://reelo.am')

export function getMetadataFromDB(
	locale: string,
	CONTENT: Record<SiteLocale, PageContent>,
	subFolder: string = '',
	slug: string = '',
): Metadata {
	const lang = (locale in CONTENT ? locale : 'en') as SiteLocale
	const content = CONTENT[lang]
	return {
		metadataBase: SITE_URL,
		title: content.title,
		description: content.description,
		alternates: {
			canonical: `/${lang}${subFolder}${slug}`,
			languages: {
				en: `/en${subFolder}${slug}`,
				ru: `/ru${subFolder}${slug}`,
				hy: `/hy${subFolder}${slug}`,
				'x-default': `/en${subFolder}${slug}`,
			},
		},
		openGraph: {
			title: content.ogTitle,
			description: content.ogDescription,
			siteName: 'Reelo',
			url: `/${lang}${subFolder}${slug}`,
			locale: OG_LOCALES[lang],
			alternateLocale: Object.entries(OG_LOCALES)
				.filter(([key]) => key !== lang)
				.map(([, value]) => value),
			type: 'website',
		},
	}
}
