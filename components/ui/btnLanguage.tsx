'use client'

import { routing } from '@/i18n/routing'
import { usePathname } from '@/i18n/routing'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import type { Locale } from 'next-intl'
import { withQuery } from '@/libs/withQuery'
import Dropdowns from '../shared/dropDowns'

export default function BtnLanguage() {
	const t = useTranslations('language')
	const locale = useLocale() as Locale

	const pathname = usePathname()
	const href = withQuery(pathname, useSearchParams().toString())

	const languages = routing.locales.map(code => ({
		locale: code,
		label: t(code),
		icon: `/lang_icons/${code}.svg`,
		href,
		current: code === locale,
	}))

	const current = languages.find(item => item.current) ?? languages[0]

	return (
		<div className='btn-lang'>
			<Dropdowns
				trigger={{ icon: current.icon, alt: current.label }}
				items={languages}
			/>
		</div>
	)
}
