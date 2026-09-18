import { getSliderItems } from '@/libs/catalog'
import { getLocale } from 'next-intl/server'
import TopSliderView from './TopSliderView'

export default async function TopSlider() {
	const locale = await getLocale()

	return <TopSliderView data={getSliderItems(locale)} />
}
