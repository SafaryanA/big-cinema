'use client'

import { THEME_COOKIE } from '@/libs/theme'
import { usePathname } from 'next/navigation'
import { useLayoutEffect } from 'react'

export default function ThemeKeeper() {
	const pathname = usePathname()

	useLayoutEffect(() => {
		const root = document.documentElement

		if (document.cookie.split('; ').includes(`${THEME_COOKIE}=light`)) {
			root.dataset.theme = 'light'
		} else {
			delete root.dataset.theme
		}
	}, [pathname])

	return null
}
