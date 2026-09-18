'use client'

import { useTheme } from '@/libs/useTheme'
import Image from 'next/image'

const SOURCE = {
	dark: '/images/start_block_bg_img.webp',

	light: '/images/start_block_light.webp',
} as const

export default function HeroImage({ alt }: { alt: string }) {
	const { theme } = useTheme()

	return (
		<Image
			src={SOURCE[theme]}
			alt={alt}
			fill
			sizes='100vw'
			priority
			className='object-cover'
		/>
	)
}
