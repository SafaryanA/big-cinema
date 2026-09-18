export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''
export const MIN_QUERY = 2
export const API = {
	films: '/films',
	film: (slug: string) => `/films/${slug}`,
	search: '/films/search',
	catalogue: '/catalogue',
	login: '/auth/login',
	register: '/auth/register',
	profile: '/auth/profile',
	logout: '/auth/logout',
	me: '/auth/me',
} as const
