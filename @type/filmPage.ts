import type { Locale } from 'next-intl'
import type { card } from './item'
export interface EpisodeView {
	number: number
	title: string | null
	date: string | null
	url: string | null
	poster: string | null
}

export interface SeasonView {
	number: number
	episodes: EpisodeView[]
}
export interface InfoCell {
	label: string
	url: string | null
}

export interface FilmPageProps {
	item: card
	locale: Locale
	showTrailer: boolean
}

export interface FilmSpecsProps {
	item: card
	locale: Locale
}

export interface FilmStageProps {
	slug: string
	seasons: SeasonView[] | null
	labels: {
		season: string
		series: string
		day: string
		days: string
		noDate: string
		trailer: string
		noTrailer: string
	}
	trailerUrl: string
	allowedFilmUrl: string | null
	initialTrailer: boolean
	poster?: string
	overlayBlocking: boolean
	blockedReason: 'registration' | 'subscription' | 'released'
}

export interface FilmInfoProps {
	label: string
	category: string
	value: InfoCell[]
}

export interface VideoProps {
	videoUrl: string
	startTime?: number
	onTime?: (seconds: number) => void
	poster?: string
	title?: string
}

export interface OverlayErrorVideoProps {
	blocking?: boolean
	reason: 'registration' | 'subscription' | 'released'
}

export interface SwiperFilmsCardProps {
	images: string[]
	alt: string
}

export interface RatingProps {
	rating: number
	slug: string
	canRate: boolean
	labels: {
		rate: string[]
		common: string
		invite: string
		signIn: string
	}
}
