'use client'
import type { TopSliderProps } from '@/@type/catalog'
import { Link } from '@/i18n/routing'
import { filmHref } from '@/libs/filmHref'
import Image from 'next/image'
import 'swiper/css'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './topSlider.module.scss'
import { imageSrc } from '@/libs/imageSrc'

export default function TopSliderView({ data }: TopSliderProps) {
	const eager = new Set(data.slice(0, 6).map(el => imageSrc(el.imgSrc[0])))

	return (
		<Swiper
			modules={[Autoplay]}
			autoplay={{
				delay: 3000,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			}}
			spaceBetween={20}
			breakpoints={{
				0: { slidesPerView: 1 },
				576: { slidesPerView: 2 },
				768: { slidesPerView: 3 },
				992: { slidesPerView: 4 },
				1264: { slidesPerView: 5 },
				1450: { slidesPerView: 6 },
				1790: { slidesPerView: 7 },
			}}
			loop={data.length > 5}
			className={styles.swiper}
		>
			{data.map(el => (
				<SwiperSlide className={styles.slide} key={el.id}>
					<Link className={styles.slideLink} href={filmHref(el.slug, true)}>
						<Image
							src={imageSrc(el.imgSrc[0])}
							alt={el.title}
							fill
							sizes='(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 33vw, (max-width: 1280px) 25vw, 20vw'
							style={{ objectFit: 'cover' }}
							loading={eager.has(imageSrc(el.imgSrc[0])) ? 'eager' : 'lazy'}
						/>
					</Link>
				</SwiperSlide>
			))}
		</Swiper>
	)
}
