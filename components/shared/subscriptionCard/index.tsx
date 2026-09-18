import type { SubscriptionCardProps } from '@/@type/subscription'
import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import style from './subscriptionCard.module.scss'

export default async function SubscriptionCard({
	data,
}: SubscriptionCardProps) {
	const t = await getTranslations('SubscriptionCard')

	const alt = t(`${data.title}.alt`)
	const currency = t(`${data.title}.currency`)
	const includePlat = t(`${data.title}.includePlat`)
	const listOffers: string[] = t.raw(`${data.title}.listOffers`)

	return (
		<div className={style.itemSubscription}>
			<h2 className={style.cardTitle}>{data.title}</h2>

			<Image
				width={120}
				height={120}
				src={`/subscription${data.src}`}
				alt={alt}
			/>

			<strong className={style.price}>
				{data.price > 0 && <span>{data.price}</span>} <span>{currency}</span>
			</strong>

			<p className={style.includePlat}>{includePlat}</p>

			<div className={style.innerOffers}>
				{listOffers.map(offer => (
					<div className={style.rowOffer} key={offer}>
						<div className='check-mark_frame'>
							<span className='check-mark_icon'>&#10003;</span>
						</div>
						<span className={style.offerText}>{offer}</span>
					</div>
				))}
			</div>

			<Link className='central-button' href='/registration'>
				{t('buttonBuy')}
			</Link>
		</div>
	)
}
