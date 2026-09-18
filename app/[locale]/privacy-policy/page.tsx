import { initLocale } from '@/libs/locale'
import LegalPage from '@/components/shared/legalPage'
import { createPageMetadata } from '@/libs/pageMetadata'
import { CONTENT } from './metadata'
export const generateMetadata = createPageMetadata(CONTENT, '/privacy-policy')
export default async function PrivacyPolicyPage({
	params,
}: PageProps<'/[locale]/privacy-policy'>) {
	initLocale((await params).locale)

	return <LegalPage type='PrivacyPolicy' />
}
