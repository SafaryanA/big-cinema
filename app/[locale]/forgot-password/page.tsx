import ForgotPasswordBox from '@/components/ui/forgotPasswordBox'
import { createPageMetadata } from '@/libs/pageMetadata'
import { CONTENT } from './metadata'

export const generateMetadata = createPageMetadata(
	CONTENT,
	'/forgot-password',
	{
		robots: { index: false, follow: true },
	},
)

export default function ForgotPassword() {
	return (
		<div className='mt-24'>
			<ForgotPasswordBox closeHref='/' />
		</div>
	)
}
