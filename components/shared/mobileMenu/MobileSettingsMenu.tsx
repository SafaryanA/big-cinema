'use client'

import type { MobileSettingsMenuProps } from '@/@type/catalog'
import Dropdowns from '@/components/shared/dropDowns'
import ThemeToggle from '@/components/ui/themeToggle'
import { routing, usePathname } from '@/i18n/routing'
import { useTheme } from '@/libs/useTheme'
import { withQuery } from '@/libs/withQuery'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import style from './mobileMenu.module.scss'

export default function MobileSettingsMenu({
	themeLabel,
	languageLabel,
	backLabel,
	toLightLabel,
	toDarkLabel,
	trigger,
}: MobileSettingsMenuProps) {
	const [showLanguages, setShowLanguages] = useState(false)
	const { toggle } = useTheme()

	const tLang = useTranslations('language')
	const locale = useLocale()

	const pathname = usePathname()
	const languageHref = withQuery(pathname, useSearchParams().toString())

	const mainItems = [
		{
			label: themeLabel,
			control: <ThemeToggle toLight={toLightLabel} toDark={toDarkLabel} />,
			keepOpen: true,
			onSelect: toggle,
		},
		{
			label: languageLabel,
			icon: `/lang_icons/${locale}.svg`,
			alt: tLang(locale),
			keepOpen: true,
			onSelect: () => setShowLanguages(true),
		},
	]

	const languageItems = [
		{
			label: backLabel,
			keepOpen: true,
			onSelect: () => setShowLanguages(false),
		},
		...routing.locales.map(code => ({
			locale: code,
			label: tLang(code),
			icon: `/lang_icons/${code}.svg`,
			href: languageHref,
			current: code === locale,
		})),
	]

	return (
		<Dropdowns
			classStyle='left'
			trigger={trigger}
			itemsClass={`${style.mobileMenuItems} ${style.settingsItems}`}
			items={showLanguages ? languageItems : mainItems}
			onClose={() => setShowLanguages(false)}
		/>
	)
}
