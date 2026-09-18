import RegistrationBox from '@/components/ui/registrationBox'
import { createPageMetadata } from '@/libs/pageMetadata'
import { CONTENT } from './metadata'

export const generateMetadata = createPageMetadata(CONTENT, '/registration', {
	robots: { index: false, follow: true },
})

export default function Registration() {
	return (
		<div className='mt-24'>
			<RegistrationBox closeHref='/' />
		</div>
	)
}
