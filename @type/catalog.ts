import type { Locale } from 'next-intl'
import type { SliderItem } from './item'
import type { DropdownTrigger } from './ui'
import type { CategoryField } from '@/libs/filmInfo'
import type { CardView } from './item'

export interface CatalogFilter {
	type: CategoryField
	value: string
}

export interface CatalogSlice {
	cards: CardView[]
	hasMore: boolean
	total: number
}

export interface MenuEntry {
	url: string
	label: string
}

export interface MenuData {
	genres: MenuEntry[]
	studios: MenuEntry[]
	countries: MenuEntry[]
	years: number[]
}

export type { CategoryField }
export type { Plan } from '@/libs/plans'

export interface CategoryPageProps {
	type: CategoryField
	value: string
	locale: Locale
}

export interface FilmsFeedProps {
	initial: CardView[]
	initialHasMore: boolean
	locale: Locale
	filter?: CatalogFilter | null
}

export interface PopUpProps {
	data: MenuData | null
	onSelect: () => void
}

export interface MobileCatalogMenuProps {
	labels: string[]
	trigger: DropdownTrigger
}

export interface MobileSettingsMenuProps {
	themeLabel: string
	languageLabel: string
	backLabel: string
	toLightLabel: string
	toDarkLabel: string
	trigger: DropdownTrigger
}

export interface MainMenuItemProps {
	menuItems: readonly string[]
	translation: Record<string, string>
}

export interface TopSliderProps {
	data: SliderItem[]
}
