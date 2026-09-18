import LoginBox from '@/components/ui/loginBox'
import { createPageMetadata } from '@/libs/pageMetadata'
import { CONTENT } from './metadata'

export const generateMetadata = createPageMetadata(CONTENT, '/login', {
	robots: { index: false, follow: true },
})

export default function Login() {
	return (
		<div className='mt-24'>
			<LoginBox closeHref='/' />
		</div>
	)
}
