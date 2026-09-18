import { SITE_URL } from '@/libs/metadataLib'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/api/', '/_next/'],
		},
		sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
		host: SITE_URL.origin,
	}
}
