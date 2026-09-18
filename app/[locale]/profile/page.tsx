import { initLocale } from '@/libs/locale'
import TopSlider from '@/components/shared/topSlider'
import { Metadata } from 'next'
import { redirect } from '@/i18n/routing'

import ProfileBox from '@/components/ui/profileBox'
import { getCurrentUser } from '@/libs/auth'

export const metadata: Metadata = {
	robots: {
		index: false,
		follow: false,
	},
}

export default async function Profile({
	params,
}: PageProps<'/[locale]/profile'>) {
	const locale = initLocale((await params).locale)

	const user = await getCurrentUser()
	if (!user) return redirect({ href: '/login', locale })

	return (
		<div className='mt-24'>
			<TopSlider />
			<ProfileBox closeHref='/' user={user} />
		</div>
	)
}
