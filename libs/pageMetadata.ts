import type {
	PageContent,
	SiteLocale,
	StaticSection,
} from '@/@type/metadataLib'
import { getMetadataFromDB } from '@/libs/metadataLib'
import type { Metadata } from 'next'

export function createPageMetadata(
	CONTENT: Record<SiteLocale, PageContent>,
	subFolder: StaticSection = '',
	extra: Metadata = {},
) {
	return async function generateMetadata({
		params,
	}: {
		params: Promise<{ locale: string }>
	}): Promise<Metadata> {
		const { locale } = await params
		return {
			...getMetadataFromDB(locale, CONTENT, subFolder),
			...extra,
		}
	}
}
