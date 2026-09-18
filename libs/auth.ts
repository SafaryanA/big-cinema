import type { CurrentUser } from '@/@type/auth'
import { SESSION_COOKIE, SIGNED_OUT } from '@/libs/session'
import { cookies } from 'next/headers'

export async function getCurrentUser(): Promise<CurrentUser | null> {
	if ((await cookies()).get(SESSION_COOKIE)?.value === SIGNED_OUT) return null

	return {
		name: 'Demo',
		login: 'demo',
		email: 'demo@reelo.am',
		plan: 'Pro',
		subscribe: true,
	}
}
