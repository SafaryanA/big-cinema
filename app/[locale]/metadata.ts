import type { PageContent, SiteLocale } from '@/@type/metadataLib'
export const CONTENT: Record<SiteLocale, PageContent> = {
	en: {
		title: 'Home',
		description:
			'Watch movies, TV shows, and cartoons online in HD. A huge library of new releases and classics, easy search, and unlimited streaming with your subscription.',
		ogTitle: 'Reelo',
		ogDescription:
			'A huge library of movies and TV series in excellent quality. Watch on any device—phone, tablet, smart TV.',
	},
	ru: {
		title: 'Главная',
		description:
			'Смотрите фильмы, сериалы и мультфильмы онлайн в HD-качестве. Огромная библиотека новинок и классики, удобный поиск и неограниченный просмотр по подписке.',
		ogTitle: 'Рилло',
		ogDescription:
			'Огромная библиотека фильмов и сериалов в отличном качестве. Смотрите на любом устройстве — телефон, планшет, смарт-ТВ',
	},
	hy: {
		title: 'Գլխավոր',
		description:
			'Նոր թողարկումների և դասականների հսկայական գրադարան, հարմար որոնում և անսահմանափակ դիտում՝ բաժանորդագրությամբ:',
		ogTitle: 'Ռիլլո',
		ogDescription:
			'Ֆիլմերի և հեռուստասերիալների հսկայական գրադարան՝ գերազանց որակով: Դիտեք ցանկացած սարքով՝ հեռախոսով, պլանշետով, սմարթ հեռուստացույցով:',
	},
}

export const NOTFOUND: Record<SiteLocale, PageContent> = {
	en: {
		title: 'Page Not Found',
		description:
			'The page you are looking for does not exist or has been moved. Go back to the Reelo home page and pick a movie or TV series from the catalog.',
		ogTitle: 'Page Not Found — Reelo',
		ogDescription:
			'This page is unavailable. Return to the home page and continue watching movies and TV series on Reelo.',
	},
	ru: {
		title: 'Страница не найдена',
		description:
			'Страница, которую вы ищете, не существует или была перемещена. Вернитесь на главную Рилло и выберите фильм или сериал из каталога.',
		ogTitle: 'Страница не найдена — Рилло',
		ogDescription:
			'Эта страница недоступна. Вернитесь на главную и продолжите смотреть фильмы и сериалы на Рилло.',
	},
	hy: {
		title: 'Էջը չի գտնվել',
		description:
			'Ձեր փնտրած էջը գոյություն չունի կամ տեղափոխվել է: Վերադարձեք Ռիլլոյի գլխավոր էջ և ընտրեք ֆիլմ կամ սերիալ կատալոգից:',
		ogTitle: 'Էջը չի գտնվել — Ռիլլո',
		ogDescription:
			'Այս էջն անհասանելի է: Վերադարձեք գլխավոր էջ և շարունակեք դիտել ֆիլմեր ու սերիալներ Ռիլլոյում:',
	},
}
