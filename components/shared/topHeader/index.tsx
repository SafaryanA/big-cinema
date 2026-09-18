import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'

import BtnLanguage from '@/components/ui/btnLanguage'
import Image from 'next/image'
import { Suspense } from 'react'

import NavMenu from '@/components/shared/navMenu/navMenu'
import SearchBox from '@/components/ui/searchBox'
import UserArea from '@/components/ui/userArea'
import ThemeToggle from '@/components/ui/themeToggle'
import styles from './header.module.scss'

export default async function Header() {
	const t = await getTranslations('MainMenu')
	return (
		<div className={styles.headerWrapper}>
			<header
				className={`${styles.topHeader} flex flex-col lg:flex-row items-center justify-between `}
			>
				<Link href='/' className={`${styles.logo} flex items-center`}>
					<strong className=' mr-0.5'>Reel</strong>
					<Image src='/logo.svg' width={20} height={20} alt='logo' />
				</Link>

				<div
					className={`${styles.centreBlock} flex items-center justify-center lg:justify-between `}
				>
					<NavMenu />
					<SearchBox label={t('Search')} placeholder={t('Search')} />
				</div>

				<div
					className={`${styles.headerActions} lg:flex items-center gap-x-2 hidden`}
				>
					<ThemeToggle toLight={t('toLight')} toDark={t('toDark')} />
					<Suspense fallback={<div className='btn-lang' />}>
						<BtnLanguage />
					</Suspense>
					<UserArea
						profileLabel={t('Profile')}
						logoutLabel={t('Logout')}
						loginLabel={t('Login')}
						className={styles.login}
					/>
				</div>
			</header>
		</div>
	)
}
