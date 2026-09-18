'use client'

import { loadMenuData } from '@/libs/actions/menu'
import type { MenuData } from '@/@type/catalog'
import { useLocale } from 'next-intl'
import { useCallback, useRef, useState } from 'react'

export function useMenuData() {
	const locale = useLocale()
	const [data, setData] = useState<MenuData | null>(null)

	const busy = useRef(false)

	const load = useCallback(async () => {
		if (data || busy.current) return

		busy.current = true

		try {
			setData(await loadMenuData(locale))
		} finally {
			busy.current = false
		}
	}, [data, locale])

	return { data, load }
}
