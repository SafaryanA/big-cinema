import type { Plan } from './catalog'

interface Data {
	OfferData: {
		old: OfferData
		educational: OfferData
		trailers: OfferData
		new: OfferData
		notifications: OfferData
		noAds: OfferData
		multiple: OfferData
		devices: OfferData
	}
}

interface OfferData {
	title: string
	src: string
	text: string
}
interface Element {
	data: OfferData
	index: number
}

export type { Data, OfferData, Element }
export interface SubscriptionCardProps {
	data: {
		price: number
		title: Plan
		src: string
	}
}
