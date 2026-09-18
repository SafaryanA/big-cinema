type Locale = 'en' | 'ru' | 'hy'

type Translated = Record<Locale, string>

interface Episode {
	number: number
	date: string | null
	duration: number
	title: Translated | null
	poster: string | null
	url: string | null
}

interface Season {
	number: number
	episodes: Episode[]
}

interface Item {
	id: number
	subscribe: boolean
	type: 'series' | 'film'
	title: Translated
	slug: string
	url: string
	trailerUrl: string
	genres: itemMenu[]
	year: number
	rating: number
	imgSrc: string[]
	status: string
	translation: string
}

type CardView = Pick<
	Item,
	'id' | 'slug' | 'year' | 'rating' | 'imgSrc' | 'type' | 'subscribe'
> & {
	title: string
}

type SliderItem = Pick<Item, 'id' | 'imgSrc' | 'slug'> & { title: string }

interface card extends Item {
	subject: Translated[]
	studio: itemMenu[]
	country: itemMenu[]
	director: Translated[]
	actors: Translated[]
	description: Translated
	seasons: Season[]
}
interface itemMenu extends Translated {
	url: string
}

interface menuPopUp {
	genres: itemMenu[]
	studios: itemMenu[]
	years: number[]
	countries: itemMenu[]
}

interface menuItem {
	label: string
}

export type {
	card,
	CardView,
	Episode,
	Item,
	itemMenu,
	Locale,
	menuItem,
	menuPopUp,
	Season,
	SliderItem,
	Translated,
}
