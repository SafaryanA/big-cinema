import type { Plan } from '@/libs/plans'
import { getTranslations } from 'next-intl/server'

export async function descriptionOffers() {
	const t = await getTranslations('Subscription')
	return {
		old: {
			title: t('Old.title'),
			src: '/old.png',
			text: t('Old.text'),
		},
		educational: {
			title: t('Educational.title'),
			src: '/educational.png',
			text: t('Educational.text'),
		},
		trailers: {
			title: t('Trailers.title'),
			src: '/trailers.png',
			text: t('Trailers.text'),
		},
		new: {
			title: t('New.title'),
			src: '/new.png',
			text: t('New.text'),
		},
		notifications: {
			title: t('Notifications.title'),
			src: '/notifications.png',
			text: t('Notifications.text'),
		},
		noAds: {
			title: t('NoAds.title'),
			src: '/no_ads.png',
			text: t('NoAds.text'),
		},
		multiple: {
			title: t('Multiple.title'),
			src: '/multiple.png',
			text: t('Multiple.text'),
		},
		devices: {
			title: t('Devices.title'),
			src: '/devices.png',
			text: t('Devices.text'),
		},
	}
}

/* `title` типизирован общим списком тарифов: если названия
   разъедутся, это поймает `tsc`, а не человек глазами. */
export const dataSubscriptions: ReadonlyArray<{
	title: Plan
	src: string
	price: number
}> = [
	{
		title: 'Start',
		src: '/start.png',
		price: 0,
	},
	{
		title: 'Pro',
		src: '/pro.png',
		price: 8,
	},
	{
		title: 'Family',
		src: '/family.png',
		price: 15,
	},
] as const
