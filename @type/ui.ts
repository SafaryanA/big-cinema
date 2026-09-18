import type { Locale } from 'next-intl'
import type { ReactNode } from 'react'

export interface DropdownTrigger {
	icon?: string
	alt?: string
	label?: string
	iconClass?: string
	iconWidth?: number
	iconHeight?: number
}

export interface DropdownItem {
	label: string
	icon?: string
	iconWidth?: number
	iconHeight?: number
	alt?: string
	href?: string
	locale?: Locale
	current?: boolean
	onSelect?: () => void | Promise<void>
	control?: ReactNode
	keepOpen?: boolean
}

export interface DropdownsProps {
	trigger: DropdownTrigger
	items: DropdownItem[]
	classStyle?: 'left' | 'right'
	defaultOpen?: boolean
	itemsClass?: string
	reserveIcon?: boolean
	scrollable?: boolean
	onClose?: () => void
	onOpen?: () => void
}

export interface TitlePageProps {
	title: string
	level?: 1 | 2 | 3
	className?: string
}

export interface SearchBoxProps {
	label: string
	placeholder: string
}

export interface LegalPageProps {
	type: 'PrivacyPolicy' | 'UserAgreement'
}

export interface ErrorPageProps {
	error: Error & { digest?: string }
	unstable_retry: () => void
}

export interface GlobalErrorProps {
	error: Error & { digest?: string }
	unstable_retry: () => void
}

export interface ThemeToggleProps {
	toLight: string
	toDark: string
}

export interface InlineScriptProps {
	html: string
}

export interface TrailerToggleProps {
	checked: boolean
	onChange: (checked: boolean) => void
}

export interface LegalSection {
	heading: string
	text: string[]
}
