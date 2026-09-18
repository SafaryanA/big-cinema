'use client'

import type { FilmStageProps } from '@/@type/filmPage'
import type { SeasonView } from '@/@type/filmPage'
import Dropdowns from '@/components/shared/dropDowns'
import Video from '@/components/shared/video'
import OverlayErrorVideo from '@/components/ui/overlayErrorVideo'
import TrailerToggle from '@/components/ui/trailerToggle'
import { daysUntil } from '@/libs/daysUntil'
import {
	serverWatchPointSnapshot,
	setWatchPoint,
	subscribeWatchPoints,
	watchPointSnapshot,
	type WatchPoint,
} from '@/libs/progress'
import Image from 'next/image'
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'
import style from './FilmPage.module.scss'

function isReleased(date: string | null): boolean {
	return date !== null && daysUntil(date) <= 0
}

function firstChoice(seasons: SeasonView[] | null) {
	if (!seasons?.length) return { season: 1, episode: null as number | null }

	for (let i = seasons.length - 1; i >= 0; i--) {
		const out = seasons[i].episodes.filter(ep => isReleased(ep.date))

		if (out.length) {
			return { season: seasons[i].number, episode: out[out.length - 1].number }
		}
	}

	return {
		season: seasons[0].number,
		episode: seasons[0].episodes[0]?.number ?? null,
	}
}

export default function FilmStage({
	slug,
	seasons,
	labels,
	trailerUrl,
	allowedFilmUrl,
	initialTrailer,
	poster,
	overlayBlocking,
	blockedReason,
}: FilmStageProps) {
	const [showTrailer, setShowTrailer] = useState(initialTrailer)

	const snapshot = useSyncExternalStore(
		subscribeWatchPoints,
		useCallback(() => watchPointSnapshot(slug), [slug]),
		serverWatchPointSnapshot,
	)

	const saved = useMemo<WatchPoint | null>(
		() => (snapshot ? (JSON.parse(snapshot) as WatchPoint) : null),
		[snapshot],
	)

	const [choice, setChoice] = useState<{
		season: number
		episode: number | null
	} | null>(null)

	const [manualStart, setManualStart] = useState<number | null>(null)

	const effective =
		choice ??
		(saved ? { season: saved.season, episode: saved.episode } : null) ??
		firstChoice(seasons)

	const { season: seasonNumber, episode: episodeNumber } = effective

	const startTime = manualStart ?? saved?.time ?? 0

	const season =
		seasons?.find(item => item.number === seasonNumber) ?? seasons?.[0] ?? null

	const episode =
		season?.episodes.find(ep => ep.number === episodeNumber) ?? null

	const allowedUrl = seasons ? (episode?.url ?? null) : allowedFilmUrl

	const videoUrl = showTrailer ? trailerUrl : (allowedUrl ?? trailerUrl)

	const showOverlay = !showTrailer && allowedUrl === null

	const reason =
		seasons && episode && !isReleased(episode.date) ? 'released' : blockedReason

	const framePoster = (!showTrailer && episode?.poster) || poster

	const pickers = season && seasons && (
		<div className={style.playerPickers}>
			<Dropdowns
				scrollable
				trigger={{ label: `${labels.season}: ${seasonNumber}` }}
				items={seasons.map(item => ({
					label: `${labels.season}: ${item.number}`,
					current: item.number === seasonNumber,
					onSelect: () => {
						setManualStart(0)
						setChoice({
							season: item.number,
							episode: item.episodes[0]?.number ?? null,
						})
					},
				}))}
			/>

			<Dropdowns
				scrollable
				trigger={{ label: `${labels.series}: ${episodeNumber ?? '—'}` }}
				items={season.episodes.map(ep => ({
					label: `${labels.series}: ${ep.number}`,
					current: ep.number === episodeNumber,
					onSelect: () => {
						setManualStart(0)
						setChoice({ season: seasonNumber, episode: ep.number })
					},
				}))}
			/>
		</div>
	)

	return (
		<>
			{season && (
				<div className={style.seriesSchedule}>
					{season.episodes.map(ep => (
						<div
							key={ep.number}
							className={`${style.seriesScheduleItem} ${
								ep.number === episodeNumber
									? style.seriesScheduleItemCurrent
									: ''
							}`}
							aria-current={ep.number === episodeNumber ? 'true' : undefined}
						>
							{ep.poster && (
								<Image
									className={style.episodeShot}
									src={ep.poster}
									width={96}
									height={54}
									alt=''
								/>
							)}
							<span>
								<span>{ep.number}</span> {labels.series}
							</span>
							<span>{ep.title ?? ''}</span>
							<span>{ep.date ?? labels.noDate}</span>
							<span>
								{ep.date === null && '—'}
								{ep.date !== null &&
									daysUntil(ep.date) > 0 &&
									`${daysUntil(ep.date)} ${labels.days}`}
								{ep.date !== null && daysUntil(ep.date) < 0 && (
									<Image src='/icons/check.svg' width={10} height={10} alt='' />
								)}
								{ep.date !== null && daysUntil(ep.date) === 0 && labels.day}
							</span>
						</div>
					))}
				</div>
			)}

			<div className={style.filmPlayer}>
				<div className={style.containerToggleSwitch}>
					<span>{labels.trailer}</span>
					<TrailerToggle
						checked={!showTrailer}
						onChange={next => setShowTrailer(!next)}
					/>
					<span>{labels.noTrailer}</span>
					{pickers}
				</div>
				<div className={style.filmInner}>
					<Video
						key={videoUrl}
						videoUrl={videoUrl}
						poster={framePoster}
						title={labels.trailer}
						startTime={startTime}
						onTime={seconds => {
							if (episodeNumber === null) return

							setWatchPoint(slug, {
								season: seasonNumber,
								episode: episodeNumber,
								time: seconds,
							})
						}}
					/>
					{showOverlay && (
						<OverlayErrorVideo reason={reason} blocking={overlayBlocking} />
					)}
				</div>
			</div>
		</>
	)
}
