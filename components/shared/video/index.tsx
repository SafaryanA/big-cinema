'use client'

import type { VideoProps } from '@/@type/filmPage'
import { youTubeEmbed, youTubeId } from '@/libs/videoSource'
import { useEffect, useRef } from 'react'

const REPORT_EVERY = 5

export default function Video({
	videoUrl,
	poster,
	startTime = 0,
	onTime,
	title,
}: VideoProps) {
	const ref = useRef<HTMLVideoElement>(null)
	const lastReported = useRef(0)

	const external = youTubeId(videoUrl)
	useEffect(() => {
		const video = ref.current

		if (!video || startTime <= 0) return

		const seek = () => {
			if (startTime < video.duration) video.currentTime = startTime
		}

		if (video.readyState >= 1) seek()
		else video.addEventListener('loadedmetadata', seek, { once: true })

		return () => video.removeEventListener('loadedmetadata', seek)
	}, [startTime, videoUrl])

	if (external) {
		return (
			<iframe
				src={youTubeEmbed(external, startTime)}
				title={title ?? ''}
				allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
				allowFullScreen
				referrerPolicy='strict-origin-when-cross-origin'
			/>
		)
	}

	return (
		<video
			ref={ref}
			controls
			preload='metadata'
			playsInline
			poster={poster}
			onTimeUpdate={event => {
				if (!onTime) return

				const now = event.currentTarget.currentTime

				if (Math.abs(now - lastReported.current) < REPORT_EVERY) return

				lastReported.current = now
				onTime(now)
			}}
			onPause={event => onTime?.(event.currentTarget.currentTime)}
		>
			<source src={`/video/${videoUrl}`} type='video/mp4' />
			Your browser does not support the video tag.
		</video>
	)
}
