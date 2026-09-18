import UserArea from '@/components/ui/userArea'
import MobileCatalogMenu from './MobileCatalogMenu'
import MobileSettingsMenu from './MobileSettingsMenu'
import menuItems from '@/components/shared/navMenu/menuItems'
import { getTranslations } from 'next-intl/server'
import styles from './mobileMenu.module.scss'
import { Suspense } from 'react'

const menuIcon = '/icons/menu.svg'
const settingsIcon = '/icons/settings.svg'

export default async function MobileMenu() {
	const t = await getTranslations('MainMenu')
	const menuLabels = menuItems.map(item => t(item))
	return (
		<div
			className={`${styles.mobileMenu} lg:hidden flex items-center justify-center w-full h-16`}
		>
			<div className={styles.mobileMenuButton}>
				<MobileCatalogMenu
					labels={menuLabels}
					trigger={{
						icon: menuIcon,
						alt: t('Menu'),
						iconClass: styles.mobileMenuIcon,
					}}
				/>
			</div>
			<div className={styles.mobileMenuButton}>
				<Suspense fallback={null}>
					<MobileSettingsMenu
						themeLabel={t('Theme')}
						languageLabel={t('Language')}
						backLabel={t('Back')}
						toLightLabel={t('toLight')}
						toDarkLabel={t('toDark')}
						trigger={{
							icon: settingsIcon,
							alt: t('Settings'),
							iconClass: styles.mobileMenuIcon,
						}}
					/>
				</Suspense>
			</div>
			<div className={`${styles.mobileUserButton} d-menu`}>
				<UserArea
					profileLabel={t('Profile')}
					logoutLabel={t('Logout')}
					loginLabel={t('Login')}
					className={styles.login}
				/>
			</div>
		</div>
	)
}
