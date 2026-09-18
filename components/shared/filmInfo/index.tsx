import type { FilmInfoProps } from '@/@type/filmPage'
import { Link } from '@/i18n/routing'
import { Fragment } from 'react'
import style from './filmInfo.module.scss'

export default function FilmInfo({ label, category, value }: FilmInfoProps) {
	return (
		<div className={style.infoInner}>
			<strong className='mr-10'>{label} :</strong>
			{value.map((cell, i) => (
				<Fragment key={cell.url ?? cell.label}>
					{cell.url !== null ? (
						<Link href={`/${cell.url}?type=${category}`}>{cell.label}</Link>
					) : (
						<span>{cell.label}</span>
					)}
					{i < value.length - 1 && <span className='ml-2 mr-2'>/</span>}
				</Fragment>
			))}
		</div>
	)
}
