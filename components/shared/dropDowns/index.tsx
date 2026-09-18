'use client'

import type { DropdownsProps } from '@/@type/ui'
import type { DropdownItem } from '@/@type/ui'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import {
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
	type KeyboardEvent,
} from 'react'

import style from './dropdowns.module.scss'

function ItemContent({
	item,
	reserveIcon,
}: {
	item: DropdownItem
	reserveIcon?: boolean
}) {
	return (
		<>
			{item.icon ? (
				<span className='img-wrapper'>
					<Image
						width={item.iconWidth ?? 20}
						height={item.iconHeight ?? 20}
						className={style.dropdownItemIcon}
						src={item.icon}
						alt={item.alt ?? ''}
					/>
				</span>
			) : (
				reserveIcon && <span className='img-wrapper' aria-hidden='true' />
			)}
			<span>{item.label}</span>
		</>
	)
}

export default function Dropdowns({
	trigger,
	items,
	classStyle,
	defaultOpen = false,
	itemsClass,
	reserveIcon,
	scrollable,
	onClose,
	onOpen,
}: DropdownsProps) {
	const [isOpen, setIsOpen] = useState<boolean>(defaultOpen)
	const listId = useId()
	const rootRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLButtonElement>(null)

	const itemRefs = useRef<Array<HTMLElement | null>>([])

	const typed = useRef('')
	const typedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

	const close = useCallback(() => {
		setIsOpen(false)
		onClose?.()
	}, [onClose])

	useEffect(() => {
		if (!isOpen) return

		const onPointerDown = (event: MouseEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) close()
		}

		document.addEventListener('mousedown', onPointerDown)

		return () => document.removeEventListener('mousedown', onPointerDown)
	}, [isOpen, close])
	useEffect(() => {
		if (!isOpen) return

		const start = Math.max(
			items.findIndex(item => item.current),
			0,
		)

		itemRefs.current[start]?.focus()
	}, [isOpen, items])

	function focusAt(index: number) {
		const last = items.length - 1
		const next = index < 0 ? last : index > last ? 0 : index

		itemRefs.current[next]?.focus()
	}

	function currentIndex(): number {
		return itemRefs.current.findIndex(node => node === document.activeElement)
	}

	function closeAndReturn() {
		close()
		triggerRef.current?.focus()
	}

	function onListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
		const here = currentIndex()

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault()
				focusAt(here + 1)
				return
			case 'ArrowUp':
				event.preventDefault()
				focusAt(here - 1)
				return
			case 'Home':
				event.preventDefault()
				focusAt(0)
				return
			case 'End':
				event.preventDefault()
				focusAt(items.length - 1)
				return
			case 'Escape':
				event.preventDefault()
				closeAndReturn()
				return
			case 'Tab':
				close()
				return
		}

		if (event.key.length !== 1 || event.altKey || event.ctrlKey) return

		typed.current += event.key.toLowerCase()

		if (typedTimer.current) clearTimeout(typedTimer.current)
		typedTimer.current = setTimeout(() => {
			typed.current = ''
		}, 1000)

		const found = items.findIndex(item =>
			item.label.toLowerCase().startsWith(typed.current),
		)

		if (found !== -1) focusAt(found)
	}

	function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
		if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

		event.preventDefault()
		setIsOpen(true)
		onOpen?.()
	}

	return (
		<div className={`dropdown-root ${style.dropdown}`} ref={rootRef}>
			<button
				type='button'
				ref={triggerRef}
				aria-haspopup='true'
				aria-expanded={isOpen}
				aria-controls={listId}
				onClick={() => {
					const next = !isOpen
					setIsOpen(next)
					if (next) onOpen?.()
					else onClose?.()
				}}
				onKeyDown={onTriggerKeyDown}
				className={style.dropdownButton}
			>
				{trigger.icon && (
					<Image
						width={trigger.iconWidth ?? 20}
						height={trigger.iconHeight ?? 20}
						className={trigger.iconClass}
						src={trigger.icon}
						alt={trigger.alt ?? ''}
					/>
				)}{' '}
				{trigger.label && <span>{trigger.label}</span>}
			</button>

			<div
				id={listId}
				onKeyDown={onListKeyDown}
				className={`dropdown-items ${style.dropdownItems} ${
					scrollable ? style.dropdownScroll : ''
				} ${itemsClass ?? ''} ${classStyle ?? ''} ${
					isOpen ? 'dropdown-items-active' : ''
				}`}
			>
				{items.map((item, index) => {
					const className = item.current ? style.dropdownItemCurrent : undefined
					const keep = (node: HTMLElement | null) => {
						itemRefs.current[index] = node
					}

					if (item.control) {
						return (
							<div
								key={item.label}
								className={`dropdown-item-static ${style.dropdownItemStatic}`}
							>
								<span className='img-wrapper'>{item.control}</span>
								{item.onSelect ? (
									<button
										ref={keep}
										type='button'
										className={style.dropdownItemStaticLabel}
										tabIndex={isOpen ? 0 : -1}
										onClick={() => {
											item.onSelect?.()
											if (!item.keepOpen) close()
										}}
									>
										{item.label}
									</button>
								) : (
									<span>{item.label}</span>
								)}
							</div>
						)
					}

					return item.href !== undefined ? (
						<Link
							key={item.label}
							ref={keep}
							href={item.href}
							locale={item.locale}
							className={className}
							aria-current={item.current ? 'true' : undefined}
							tabIndex={isOpen ? 0 : -1}
							onClick={() => {
								item.onSelect?.()
								close()
							}}
						>
							<ItemContent item={item} reserveIcon={reserveIcon} />
						</Link>
					) : (
						<button
							key={item.label}
							ref={keep}
							type='button'
							className={className}
							aria-current={item.current ? 'true' : undefined}
							tabIndex={isOpen ? 0 : -1}
							onClick={() => {
								item.onSelect?.()
								if (!item.keepOpen) close()
							}}
						>
							<ItemContent item={item} reserveIcon={reserveIcon} />
						</button>
					)
				})}
			</div>
		</div>
	)
}
