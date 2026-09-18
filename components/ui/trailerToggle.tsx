'use client'

import type { TrailerToggleProps } from '@/@type/ui'

export default function TrailerToggle({
	checked,
	onChange,
}: TrailerToggleProps) {
	return (
		<input
			className='toggle-switch'
			type='checkbox'
			checked={checked}
			onChange={event => onChange(event.target.checked)}
		/>
	)
}
