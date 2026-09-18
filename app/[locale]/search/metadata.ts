import type { PageContent, SiteLocale } from '@/@type/metadataLib'
export const CONTENT: Record<SiteLocale, PageContent> = {
	en: {
		title: 'Search',
		description:
			'Search Reelo by title: movies and TV series across all languages of the catalogue.',
		ogTitle: 'Search on Reelo',
		ogDescription: 'Find a movie or a series by its title.',
	},
	ru: {
		title: 'Поиск',
		description:
			'Поиск по Рилло: фильмы и сериалы по названию на всех языках каталога.',
		ogTitle: 'Поиск в Рилло',
		ogDescription: 'Найдите фильм или сериал по названию.',
	},
	hy: {
		title: 'Որոնում',
		description:
			'Որոնում Ռիլլոյում՝ ֆիլմեր և սերիալներ ըստ վերնագրի՝ կատալոգի բոլոր լեզուներով:',
		ogTitle: 'Որոնում Ռիլլոյում',
		ogDescription: 'Գտեք ֆիլմ կամ սերիալ ըստ վերնագրի:',
	},
}
