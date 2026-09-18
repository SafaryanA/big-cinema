import type { FilmSpecsProps } from '@/@type/filmPage'
import type { itemMenu, Translated } from '@/@type/item'
import FilmInfo from '@/components/shared/filmInfo'
import { filmInfo } from '@/libs/filmInfo'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import style from './FilmPage.module.scss'
import { imageSrc } from '@/libs/imageSrc'

export default async function FilmSpecs({ item, locale }: FilmSpecsProps) {
	const t = await getTranslations('FilmPage')
	const tData = await getTranslations('FilmData')

	const durations = item.seasons.flatMap(s => s.episodes.map(e => e.duration))
	const min = Math.min(...durations)
	const max = Math.max(...durations)
	const duration = min === max ? String(min) : `${min}–${max}`

	const statusLabels: Record<string, string> = {
		airing: tData('status.airing'),
	}

	const plain = (v: string) => [{ label: v, url: null }]
	const texts = (v: Translated[]) =>
		v.map(x => ({ label: x[locale], url: null }))
	const links = (v: itemMenu[]) =>
		v.map(x => ({ label: x[locale], url: x.url }))

	const info = {
		year: [{ label: String(item.year), url: String(item.year) }],
		genres: links(item.genres),
		duration: plain(duration),
		subject: texts(item.subject),
		status: plain(statusLabels[item.status] ?? item.status),
		translation: plain(item.translation),
		studio: links(item.studio),
		country: links(item.country),
		director: texts(item.director),
		actors: texts(item.actors),
	}

	return (
		<div className={style.filmInfo}>
			<div className={style.filmCover}>
				<Image
					className='p-0.5'
					src={imageSrc(item.imgSrc[0])}
					width={300}
					height={700}
					alt={`${t('picture')} ${item.title[locale]}`}
				/>
			</div>
			<div>
				{filmInfo.map(({ field, label }) => (
					<FilmInfo
						key={field}
						value={info[field]}
						category={field}
						label={t(label)}
					/>
				))}
			</div>
		</div>
	)
}
