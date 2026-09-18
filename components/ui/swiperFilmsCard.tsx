import type { SwiperFilmsCardProps } from '@/@type/filmPage'
import Image from 'next/image'
import style from './swiperFilmsCard.module.scss'
import { imageSrc } from '@/libs/imageSrc'

export default function SwiperFilmsCard({ images, alt }: SwiperFilmsCardProps) {
	return (
		<div className={style.posters}>
			{images.map((src, index) => (
				<Image
					key={src}
					className={style.poster}
					src={imageSrc(src)}
					alt={index === 0 ? alt : ''}
					fill
					sizes='(max-width: 576px) 50vw, (max-width: 992px) 33vw, (max-width: 1280px) 25vw, 20vw'
					priority={false}
				/>
			))}
		</div>
	)
}
