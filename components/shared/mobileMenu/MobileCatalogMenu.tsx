'use client'

import type { MobileCatalogMenuProps } from '@/@type/catalog'
import Dropdowns from '@/components/shared/dropDowns'
import PopUp from '@/components/shared/popUp'
import { useMenuData } from '@/libs/useMenuData'
import { useEffect, useRef, useState } from 'react'
import style from './mobileMenu.module.scss'

export default function MobileCatalogMenu({
	labels,
	trigger,
}: MobileCatalogMenuProps) {
	const [open, setOpen] = useState(false)
	const { data, load } = useMenuData()
	const rootRef = useRef<HTMLDivElement>(null)

	const close = () => setOpen(false)

	useEffect(() => {
		if (!open) return

		const onPointerDown = (event: MouseEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) close()
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
	}, [open])

	const sections = labels.map(label => ({
		label,
		onSelect: () => {
			void load()
			setOpen(true)
		},
	}))

	return (
		<div ref={rootRef}>
			<Dropdowns
				classStyle='left'
				trigger={trigger}
				itemsClass={style.mobileMenuItems}
				items={sections}
			/>
			{open && <PopUp data={data} onSelect={close} />}
		</div>
	)
}
