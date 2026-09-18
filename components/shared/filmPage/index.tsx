import type { FilmPageProps } from '@/@type/filmPage'
import Rating from '@/components/shared/rating'
import TopSlider from '@/components/shared/topSlider'
import CardsGrid from '@/components/ui/cardsGrid'
import TitlePage from '@/components/ui/titlePage'
import { getSimilar } from '@/libs/catalog'
import { getCurrentUser } from '@/libs/auth'
import { daysUntil } from '@/libs/daysUntil'
import { getTranslations } from 'next-intl/server'
import style from './FilmPage.module.scss'
import type { SeasonView } from '@/@type/filmPage'
import FilmStage from './FilmStage'
import FilmSpecs from './FilmSpecs'
import { imageSrc } from '@/libs/imageSrc'

export default async function FilmPage({
	item,
	locale,
	showTrailer,
}: FilmPageProps) {
	const t = await getTranslations('FilmPage')
	const tData = await getTranslations('FilmData')

	const episodesCount = item.seasons.reduce(
		(sum, season) => sum + season.episodes.length,
		0,
	)

	const user = await getCurrentUser()
	const registered = user !== null

	const releaseDate = item.seasons[0].episodes[0].date
	const isReleased = releaseDate !== null && daysUntil(releaseDate) <= 0

	const canWatchFilm =
		isReleased && registered && (!item.subscribe || Boolean(user?.subscribe))

	const allowedFilmUrl = canWatchFilm ? item.url : null

	const mayWatch = registered && (!item.subscribe || Boolean(user?.subscribe))

	const seasonsView: SeasonView[] | null =
		item.type === 'series'
			? item.seasons.map(season => ({
					number: season.number,
					episodes: season.episodes.map(ep => {
						const out = ep.date !== null && daysUntil(ep.date) <= 0 && mayWatch

						return {
							number: ep.number,
							title: ep.title ? ep.title[locale] : null,
							date: ep.date,
							url: out ? (ep.url ?? item.url) : null,
							poster: ep.poster ? imageSrc(ep.poster) : null,
						}
					}),
				}))
			: null
	const blockedReason = !isReleased
		? ('released' as const)
		: !registered
			? ('registration' as const)
			: ('subscription' as const)

	const similar = getSimilar(item, locale)

	return (
		<div className='container_body container_height'>
			<div className={style.sliderBlock}>
				<h2 className='slider_title'>{t('sliderTitle')}</h2>
				<div className='slider'>
					<TopSlider />
				</div>
			</div>

			<div className={style.filmPageInner}>
				<TitlePage title={item.title[locale]} />
				{item.type === 'series' && (
					<p className={style.filmSeries}>
						{tData('type.series')} · {t('season')}: {item.seasons.length} ·{' '}
						{t('series')}: {episodesCount}
					</p>
				)}
			</div>

			<Rating
				rating={item.rating}
				slug={item.slug}
				canRate={registered}
				labels={{
					rate: Array.from({ length: 10 }, (_, index) =>
						t('rate', { value: index + 1 }),
					),
					common: t('commonRating', { value: item.rating }),
					invite: t('rateInvite'),
					signIn: t('rateSignIn'),
				}}
			/>

			<FilmSpecs item={item} locale={locale} />

			<div className={style.filmBlock}>
				<FilmStage
					slug={item.slug}
					seasons={seasonsView}
					labels={{
						season: t('season'),
						series: t('series'),
						day: t('day'),
						days: t('days'),
						noDate: t('noDate'),
						trailer: t('trailer'),
						noTrailer: t('noTrailer'),
					}}
					trailerUrl={item.trailerUrl}
					allowedFilmUrl={allowedFilmUrl}
					initialTrailer={showTrailer}
					poster={item.imgSrc[0] ? imageSrc(item.imgSrc[0]) : undefined}
					overlayBlocking={!item.trailerUrl}
					blockedReason={blockedReason}
				/>
			</div>

			<div className={style.filmDescription}>{item.description[locale]}</div>
			<CardsGrid cards={similar} />
		</div>
	)
}
