'use client'

import type { SearchBoxProps } from '@/@type/ui'
import { usePathname, useRouter } from '@/i18n/routing'
import { MIN_QUERY } from '@/libs/api'
import { useCallback, useEffect, useState } from 'react'
import style from './searchBox.module.scss'

const DEBOUNCE = 2000

const SEARCH_PATH = '/search'

export default function SearchBox({ label, placeholder }: SearchBoxProps) {
	const router = useRouter()
	const pathname = usePathname()

	const [query, setQuery] = useState('')
	const [openedBySearch, setOpenedBySearch] = useState(false)
	const [lastPath, setLastPath] = useState(pathname)

	const onSearchPage = pathname === SEARCH_PATH

	if (pathname !== lastPath) {
		setLastPath(pathname)

		if (!onSearchPage) {
			setQuery('')
			setOpenedBySearch(false)
		}
	}

	const text = query.trim()

	const go = useCallback(
		(value: string, replace: boolean) => {
			const href = `${SEARCH_PATH}?q=${encodeURIComponent(value)}`

			if (replace) {
				router.replace(href)

				return
			}

			setOpenedBySearch(true)
			router.push(href)
		},
		[router],
	)

	useEffect(() => {
		if (text.length < MIN_QUERY) return

		const timer = setTimeout(() => go(text, onSearchPage), DEBOUNCE)

		return () => clearTimeout(timer)
	}, [text, onSearchPage, go])

	useEffect(() => {
		if (text.length > 0 || !onSearchPage || !openedBySearch) return

		router.back()
	}, [text, onSearchPage, openedBySearch, router])

	return (
		<div className={style.searchBox}>
			<form
				className={style.searchForm}
				role='search'
				onSubmit={event => {
					event.preventDefault()

					if (text.length < MIN_QUERY) return

					go(text, onSearchPage)
				}}
			>
				<label htmlFor='search' className='visually-hidden'>
					{label}
				</label>
				<input
					className={style.searchInput}
					id='search'
					name='q'
					type='search'
					autoComplete='off'
					placeholder={placeholder}
					value={query}
					onChange={event => setQuery(event.target.value)}
				/>
			</form>
		</div>
	)
}
