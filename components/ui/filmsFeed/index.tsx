'use client'

import type { FilmsFeedProps } from '@/@type/catalog'
import { loadFilms } from '@/libs/actions/catalog'
import { AUTO_PAGES, MAX_PAGES, PAGE_SIZE } from '@/libs/catalog'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import CardsGrid from '../cardsGrid'
import style from './filmsFeed.module.scss'

export default function FilmsFeed({
	initial,
	initialHasMore,
	locale,
	filter = null,
}: FilmsFeedProps) {
	const t = useTranslations('Catalog')

	const [cards, setCards] = useState(initial)
	const [hasMore, setHasMore] = useState(initialHasMore)
	const [loading, setLoading] = useState(false)
	const [savedPage] = useState(() => {
		if (typeof window === 'undefined') return 0

		const page =
			Number(new URLSearchParams(window.location.search).get('page')) || 0

		return Math.min(page, MAX_PAGES)
	})

	const busy = useRef(false)
	const restored = useRef(false)
	const sentinel = useRef<HTMLDivElement>(null)

	const autoOff = cards.length >= PAGE_SIZE * AUTO_PAGES

	const fetchMore = useCallback(
		async (offset: number, limit: number) => {
			if (busy.current) return

			busy.current = true
			setLoading(true)

			try {
				const slice = await loadFilms(offset, limit, locale, filter)

				setCards(prev => [...prev, ...slice.cards])
				setHasMore(slice.hasMore)
			} finally {
				busy.current = false
				setLoading(false)
			}
		},
		[locale, filter],
	)

	const loadNext = useCallback(() => {
		void fetchMore(cards.length, PAGE_SIZE)
	}, [fetchMore, cards.length])

	useEffect(() => {
		if (restored.current) return
		restored.current = true

		if (savedPage < 2) return

		void fetchMore(PAGE_SIZE, PAGE_SIZE * (savedPage - 1))
	}, [fetchMore, savedPage])

	useEffect(() => {
		const node = sentinel.current

		if (!node) return

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0]?.isIntersecting) loadNext()
			},
			{ rootMargin: '600px' },
		)

		observer.observe(node)

		return () => observer.disconnect()
	}, [loadNext, hasMore, autoOff])

	useEffect(() => {
		const page = Math.min(Math.ceil(cards.length / PAGE_SIZE), MAX_PAGES)
		const params = new URLSearchParams(window.location.search)

		if (page > 1) params.set('page', String(page))
		else params.delete('page')

		const query = params.toString()

		window.history.replaceState(
			null,
			'',
			query ? `?${query}` : window.location.pathname,
		)
	}, [cards.length])

	return (
		<>
			<CardsGrid cards={cards} />

			{loading && (
				<div className='container_body' aria-hidden='true'>
					<div className='grid-films-card-wrapper'>
						<div className='grid-films-card'>
							{Array.from({ length: PAGE_SIZE }, (_, i) => (
								<div key={i} className={style.skeleton} />
							))}
						</div>
					</div>
				</div>
			)}

			<div className={style.foot}>
				{hasMore && !autoOff && (
					<div ref={sentinel} className={style.sentinel} aria-hidden='true' />
				)}

				<p className={style.status} role='status' aria-live='polite'>
					{loading ? t('loading') : hasMore ? '' : t('end')}
				</p>

				{hasMore && autoOff && (
					<button
						type='button'
						className='central-button'
						onClick={loadNext}
						disabled={loading}
					>
						{t('showMore')}
					</button>
				)}
			</div>
		</>
	)
}
