import { getTranslations } from 'next-intl/server'
import MainMenuItem from './index'
import style from './mainMenuItem.module.scss'
import menuItems from './menuItems'
export default async function NavMenu() {
	const t = await getTranslations('MainMenu')
	const translation = Object.fromEntries(menuItems.map(key => [key, t(key)]))
	return (
		<nav className={style.mainMenu}>
			<MainMenuItem translation={translation} menuItems={menuItems} />
		</nav>
	)
}
