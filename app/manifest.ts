import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		id: '/',
		name: 'Reelo',
		short_name: 'Reelo',
		description:
			'Фильмы, сериалы и мультфильмы онлайн: новинки, классика, поиск и просмотр по подписке.',
		lang: 'ru',
		start_url: '/',
		scope: '/',
		display: 'standalone',
		orientation: 'portrait',
		theme_color: '#0a0a0a',
		background_color: '#0a0a0a',
		categories: ['entertainment', 'video'],
		icons: [
			{
				src: '/web-app-manifest-192x192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/web-app-manifest-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/web-app-manifest-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
	}
}
