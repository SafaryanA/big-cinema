export function useRouter() {
	return {
		push: () => {},
		replace: () => {},
		back: () => {},
		forward: () => {},
		refresh: () => {},
		prefetch: () => {},
	}
}

export function usePathname(): string {
	return '/'
}

export function useSearchParams(): URLSearchParams {
	return new URLSearchParams()
}

export function useParams(): Record<string, string> {
	return {}
}

export function useSelectedLayoutSegment(): string | null {
	return null
}

export function useSelectedLayoutSegments(): string[] {
	return []
}

export function notFound(): never {
	throw new Error('notFound')
}

export function redirect(url: string): never {
	throw new Error(`redirect: ${url}`)
}

export function permanentRedirect(url: string): never {
	throw new Error(`permanentRedirect: ${url}`)
}

export const RedirectType = { push: 'push', replace: 'replace' } as const
