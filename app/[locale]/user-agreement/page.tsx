import { initLocale } from '@/libs/locale'
import LegalPage from '@/components/shared/legalPage'
import { createPageMetadata } from '@/libs/pageMetadata'
import { CONTENT } from './metadata'

export const generateMetadata = createPageMetadata(CONTENT, '/user-agreement')
export default async function UserAgreementPage({
	params,
}: PageProps<'/[locale]/user-agreement'>) {
	initLocale((await params).locale)

	return <LegalPage type='UserAgreement' />
}
