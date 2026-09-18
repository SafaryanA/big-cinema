import type { Data } from '@/@type/subscription'
import OfferExplanation from '../offerExplanation'

const offerDataKeys = [
	'old',
	'educational',
	'trailers',
	'new',
	'notifications',
	'noAds',
	'multiple',
	'devices',
] as const satisfies (keyof Data['OfferData'])[]

export default function OffersExplanations(props: Data) {
	return (
		<>
			{offerDataKeys.map((el, i) => (
				<OfferExplanation key={el} data={props.OfferData[el]} index={i + 1} />
			))}
		</>
	)
}
