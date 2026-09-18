'use client'

import type { MainMenuItemProps } from '@/@type/catalog'
import { useMenuData } from '@/libs/useMenuData'
import { useEffect, useRef, useState } from 'react'
import PopUp from '../popUp'

import style from './mainMenuItem.module.scss'

export default function MainMenuItem({
	translation,
	menuItems,
}: MainMenuItemProps) {
	const [activeBtn, setActiveBtn] = useState<string>('')
	const menuRef = useRef<HTMLDivElement>(null)

	const { data, load } = useMenuData()

	const close = () => setActiveBtn('')

	const toggle = (key: string) => {
		void load()
		setActiveBtn(current => (current === key ? '' : key))
	}

	useEffect(() => {
		if (!activeBtn) return

		const onPointerDown = (event: MouseEvent) => {
			if (!menuRef.current?.contains(event.target as Node)) close()
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close()
		}

		document.addEventListener('mousedown', onPointerDown)
		document.addEventListener('keydown', onKeyDown)

		return () => {
			document.removeEventListener('mousedown', onPointerDown)
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [activeBtn])

	return (
		<div ref={menuRef}>
			<ul className={style.mainMenuItems}>
				{menuItems.map(key => (
					<li key={key}>
						<button
							type='button'
							onClick={() => toggle(key)}
							aria-expanded={activeBtn === key}
							className={`${style.mainMenuLink} ${
								activeBtn === key ? style.mainMenuLinkActive : ''
							}`}
						>
							{translation[key]}
						</button>
					</li>
				))}
			</ul>
			{activeBtn && <PopUp data={data} onSelect={close} />}
		</div>
	)
}
