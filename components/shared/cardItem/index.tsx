'use client'

import type { CardView } from '@/@type/item'
import SwiperFilmsCard from '@/components/ui/swiperFilmsCard'
import { Link } from '@/i18n/routing'
import { filmHref } from '@/libs/filmHref'
import { useTranslations } from 'next-intl'

import style from './cardItem.module.scss'

export default function CardItem({ item }: { item: CardView }) {
	const t = useTranslations('Card')

	return (
		<Link href={filmHref(item.slug, true)} className={style.CardItemWrapper}>
			<div className={style.imageInner}>
				<SwiperFilmsCard images={item.imgSrc} alt={item.title} />

				<div className={style.badge}>
					<span className={style.badgeYear}>{item.year}</span>
					<span
						className={style.badgeRating}
						title={t('ratingOf', { value: item.rating })}
					>
						<span aria-hidden='true'>★</span>
						{item.rating}
					</span>
				</div>

				<div className={style.marks}>
					{item.type === 'series' && (
						<span className={style.mark}>{t('series')}</span>
					)}
					{item.subscribe && (
						<span className={`${style.mark} ${style.markPaid}`}>
							{t('subscription')}
						</span>
					)}
				</div>
			</div>

			<span className={style.title}>{item.title}</span>
		</Link>
	)
}
