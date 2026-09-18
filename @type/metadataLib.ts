export const OG_LOCALES = {
	en: 'en_US',
	ru: 'ru_RU',
	hy: 'hy_AM',
} as const

export type SiteLocale = keyof typeof OG_LOCALES
export type PageContent = {
	title: string
	description: string
	ogTitle: string
	ogDescription: string
}

export type StaticSection =
	| ''
	| '/login'
	| '/registration'
	| '/forgot-password'
	| '/search'
	| '/profile'
	| '/subscription'
	| '/privacy-policy'
	| '/user-agreement'
