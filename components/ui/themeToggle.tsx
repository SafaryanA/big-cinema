'use client'

import type { ThemeToggleProps } from '@/@type/ui'
import { useTheme } from '@/libs/useTheme'
import style from './themeToggle.module.scss'

export default function ThemeToggle({ toLight, toDark }: ThemeToggleProps) {
	const { theme, toggle } = useTheme()

	const next = theme === 'dark' ? 'light' : 'dark'

	return (
		<button
			type='button'
			className={style.themeToggle}
			onClick={toggle}
			aria-pressed={theme === 'light'}
			aria-label={next === 'light' ? toLight : toDark}
			title={next === 'light' ? toLight : toDark}
		>
			<span
				className={`${style.knob} ${theme === 'light' ? style.knobUp : ''}`}
				aria-hidden='true'
			>
				{theme === 'light' ? (
					<svg viewBox='0 0 24 24' width='13' height='13'>
						<circle cx='12' cy='12' r='4.5' fill='currentColor' />
						{[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
							<rect
								key={angle}
								x='11.2'
								y='1'
								width='1.6'
								height='4'
								rx='0.8'
								fill='currentColor'
								transform={`rotate(${angle} 12 12)`}
							/>
						))}
					</svg>
				) : (
					<svg viewBox='0 0 24 24' width='13' height='13'>
						<path
							d='M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z'
							fill='currentColor'
						/>
					</svg>
				)}
			</span>
		</button>
	)
}
