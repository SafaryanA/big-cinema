'use client'

import { useSyncExternalStore } from 'react'
import { THEME_COOKIE, THEME_MAX_AGE } from './theme'

export type Theme = 'light' | 'dark'

function read(): Theme {
	return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function subscribe(onChange: () => void): () => void {
	const observer = new MutationObserver(onChange)

	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme'],
	})

	return () => observer.disconnect()
}

function serverRead(): Theme {
	return 'dark'
}

export function useTheme(): { theme: Theme; toggle: () => void } {
	const theme = useSyncExternalStore(subscribe, read, serverRead)

	function toggle() {
		const next: Theme = theme === 'dark' ? 'light' : 'dark'

		document.documentElement.dataset.theme = next

		document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=${THEME_MAX_AGE}; samesite=lax`
	}

	return { theme, toggle }
}
