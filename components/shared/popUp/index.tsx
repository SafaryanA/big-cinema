'use client'

import type { PopUpProps } from '@/@type/catalog'
import style from '@/components/shared/popUp/popUp.module.scss'
import BtnLanguage from '@/components/ui/btnLanguage'
import Dropdowns from '@/components/shared/dropDowns'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Suspense } from 'react'

export default function PopUp({ data, onSelect }: PopUpProps) {
	const t = useTranslations('PopUp')
	const tCatalog = useTranslations('Catalog')
	if (!data) {
		return (
			<div className={style.popUpWrapper}>
				<div className={style.popUpInner} role='status' aria-live='polite'>
					{tCatalog('loading')}
				</div>
			</div>
		)
	}

	return (
		<div className={style.popUpWrapper}>
			<div className={style.popUpInner}>
				<div className={style.loginBtn}>
					<Suspense fallback={<div className='btn-lang' />}>
						<BtnLanguage />
					</Suspense>
				</div>

				<div className={style.genres}>
					<h2>{t('genre')}</h2>
					<div className={style.items}>
						{data.genres.map(item => (
							<Link
								key={item.url}
								href={`/${item.url}?type=genres`}
								onClick={onSelect}
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>

				<div className={style.studios}>
					<h2>{t('studio')}</h2>
					<div className={style.items}>
						{data.studios.map(item => (
							<Link
								key={item.url}
								href={`/${item.url}?type=studio`}
								onClick={onSelect}
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>

				<div className={style.filter}>
					<div className={style.years}>
						<span className={style.filterLabel}>{t('year')}</span>
						<Dropdowns
							scrollable
							trigger={{ label: t('chooseYear') }}
							items={data.years.map(year => ({
								label: String(year),
								href: `/${year}?type=year`,
								onSelect: onSelect,
							}))}
						/>
					</div>

					<div className={style.countries}>
						<span className={style.filterLabel}>{t('country')}</span>
						<Dropdowns
							scrollable
							trigger={{ label: t('chooseCountry') }}
							items={data.countries.map(item => ({
								label: item.label,
								href: `/${item.url}?type=country`,
								onSelect: onSelect,
							}))}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
