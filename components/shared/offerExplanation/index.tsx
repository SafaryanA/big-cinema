import type { Element } from '@/@type/subscription'
import Image from 'next/image'
import style from './offerExplanation.module.scss'

export default function OfferExplanation({ data, index }: Element) {
	const imageOnRight = index % 2 === 0

	return (
		<div className={`${style.containerOffer} flex`}>
			<div className={`${style.innerImage} ${imageOnRight ? 'order-1' : ''}`}>
				<Image
					src={`/offers${data.src}`}
					alt={data.title}
					fill
					sizes='(max-width:1023px) 300px, 500px'
				/>
			</div>
			<div className={style.innerText}>
				<h2
					className={`${style.offerTitle} ${
						imageOnRight ? style.offerTitleEnd : ''
					}`}
				>
					{data.title}
				</h2>
				<p className={style.description}>{data.text}</p>
			</div>
		</div>
	)
}
