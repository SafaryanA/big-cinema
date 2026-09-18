import type { LegalPageProps, LegalSection } from '@/@type/ui'
import { getTranslations } from 'next-intl/server'
import TitlePage from '../../ui/titlePage'

export default async function LegalPage({ type }: LegalPageProps) {
	const t = await getTranslations(`Legal.${type}`)
	const sections = t.raw('sections') as LegalSection[]

	return (
		<div className='legal-page '>
			<div className='legal-wrapper'>
				<TitlePage title={t('title')} />

				<p className='legal-updated'>{t('updated')}</p>
				<p className='legal-notice'>{t('notice')}</p>

				{sections.map(section => (
					<section key={section.heading} className='legal-section'>
						<h3>{section.heading}</h3>
						{section.text.map(paragraph => (
							<p key={paragraph} className='legal-body'>
								{paragraph}
							</p>
						))}
					</section>
				))}
			</div>
		</div>
	)
}
