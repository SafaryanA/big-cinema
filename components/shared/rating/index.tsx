'use client'

import type { RatingProps } from '@/@type/filmPage'
import { Link } from '@/i18n/routing'
import {
	MAX_RATING,
	MIN_RATING,
	ratingSnapshot,
	serverRatingSnapshot,
	setRating,
	subscribeRatings,
} from '@/libs/rating'
import { useCallback, useState, useSyncExternalStore } from 'react'
import style from './rating.module.scss'

const STAR = 'rating-star'
const STARS = MAX_RATING

export default function Rating({ rating, slug, canRate, labels }: RatingProps) {
	const own = useSyncExternalStore(
		subscribeRatings,
		useCallback(() => ratingSnapshot(slug), [slug]),
		serverRatingSnapshot,
	)

	const [hover, setHover] = useState<number | null>(null)

	const shown = hover ?? own ?? rating

	const integer = Math.trunc(shown)
	const fractional = shown - integer
	const cut = `${fractional * 100}%`

	const stars = Array.from({ length: STARS }, (_, index) => {
		const partial = index === integer && fractional > 0
		const empty = index >= integer && !partial

		const fill =
			index < integer
				? '#5c547e'
				: partial
					? 'url(#rating-partial)'
					: 'var(--star-empty)'

		const mark = partial ? style.starPartial : empty ? style.starEmpty : ''

		const picture = (
			<svg
				className={`${style.ratingStar} ${mark}`}
				width='296'
				height='222'
				viewBox='0 0 296 222'
				aria-hidden='true'
			>
				<use href={`#${STAR}`} fill={fill} />
			</svg>
		)

		if (!canRate) return <span key={index}>{picture}</span>

		const value = index + MIN_RATING

		return (
			<button
				key={index}
				type='button'
				className={style.starButton}
				title={labels.rate[index]}
				aria-label={labels.rate[index]}
				aria-pressed={own === value}
				onMouseEnter={() => setHover(value)}
				onMouseLeave={() => setHover(null)}
				onFocus={() => setHover(value)}
				onBlur={() => setHover(null)}
				onClick={() => setRating(slug, value)}
			>
				{picture}
			</button>
		)
	})

	return (
		<div className={style.ratingBlock}>
			<div className={`${style.filmRating} flex mt-2`} role='group'>
				<svg
					width='0'
					height='0'
					aria-hidden='true'
					style={{ position: 'absolute' }}
				>
					<defs>
						<linearGradient id='rating-partial' x1='0' y1='0' x2='1' y2='0'>
							<stop offset={cut} stopColor='#5c547e' />
							<stop offset={cut} stopColor='var(--star-empty)' />
						</linearGradient>
						<symbol id={STAR} viewBox='0 0 296 222'>
							<path d='M148 2V0L160 8L171 16L180 28L189 40L198 46L209 50L222 54L235 58L246 63L254 70L258 75L256 82L252 87L245 92L234 97L226 102L221 110L218 120L216 132L215 144L214 156V168L213 176L208 180L202 179L195 175L187 168L179 161L171 155L164 150L156 146L148 144L140 146L132 150L125 155L117 161L109 168L101 175L94 179L88 180L83 176L82 168L81 156L80 144L79 132L77 120L74 110L69 102L61 97L51 92L43 87L39 82L38 75L42 70L50 63L61 58L74 54L87 50L96 46L105 40L114 28L123 16L134 8L145 1L148 2Z' />
							<path d='M79 170L70 172L61 222L79 170Z' />
							<path d='M91 178L83 179L79 212L91 178Z' />
							<path d='M206 178L197 177L194 210L206 178Z' />
							<path d='M218 170L209 169L206 220L218 170Z' />
							<path d='M256 77V68L296 74L256 77Z' />
							<path d='M254 90L255 82L284 94L254 90Z' />
							<path d='M40 77V68L0 74L40 77Z' />
							<path d='M42 90L41 82L12 94L42 90Z' />
							<path d='M228 56V47L260 40L228 56Z' />
							<path d='M68 56V47L36 40L68 56Z' />
						</symbol>
					</defs>
				</svg>

				{stars}

				<span className='ml-2 text-2xl'>{own ?? rating}</span>
			</div>

			<p className={style.ratingNote}>
				{own !== null ? (
					labels.common
				) : canRate ? (
					labels.invite
				) : (
					<Link href='/login'>{labels.signIn}</Link>
				)}
			</p>
		</div>
	)
}
