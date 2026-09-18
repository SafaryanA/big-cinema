import { initLocale } from '@/libs/locale'
import OffersExplanations from '@/components/shared/offersExplanations'
import SubscriptionCard from '@/components/shared/subscriptionCard'
import TitlePage from '@/components/ui/titlePage'
import { createPageMetadata } from '@/libs/pageMetadata'
import { getTranslations } from 'next-intl/server'
import { dataSubscriptions, descriptionOffers } from './db'
import { CONTENT } from './metadata'
import style from './subscription.module.scss'

export const generateMetadata = createPageMetadata(CONTENT, '/subscription')

export default async function Subscription({
	params,
}: PageProps<'/[locale]/subscription'>) {
	initLocale((await params).locale)

	const t = await getTranslations('Subscription')
	const offers = await descriptionOffers()

	return (
		<>
			<TitlePage title={t('TitlePage')} className='title container_height' />
			<div className='container_body'>
				<div className={style.blockSubscription}>
					{dataSubscriptions.map(el => (
						<div className={style.cardSubscription} key={el.title}>
							<SubscriptionCard data={el} />
						</div>
					))}
				</div>
				<OffersExplanations OfferData={offers} />
			</div>
		</>
	)
}
