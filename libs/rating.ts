export const MIN_RATING = 1
export const MAX_RATING = 10

type Store = Record<string, number>

const KEY = 'reelo:rating'

function read(): Store {
	if (typeof window === 'undefined') return {}

	try {
		const raw = window.localStorage.getItem(KEY)

		return raw ? (JSON.parse(raw) as Store) : {}
	} catch {
		return {}
	}
}

function write(store: Store): void {
	try {
		window.localStorage.setItem(KEY, JSON.stringify(store))
	} catch {}
}

export function getRating(slug: string): number | null {
	const value = read()[slug]

	return typeof value === 'number' ? value : null
}

export function setRating(slug: string, value: number): void {
	if (!Number.isInteger(value) || value < MIN_RATING || value > MAX_RATING)
		return

	const store = read()

	store[slug] = value
	write(store)
	notify()
}

export function clearRating(slug: string): void {
	const store = read()

	if (!(slug in store)) return

	delete store[slug]
	write(store)
	notify()
}

const listeners = new Set<() => void>()

function notify(): void {
	for (const listener of listeners) listener()
}

export function subscribeRatings(listener: () => void): () => void {
	listeners.add(listener)

	return () => listeners.delete(listener)
}

export function ratingSnapshot(slug: string): number | null {
	return getRating(slug)
}

export function serverRatingSnapshot(): number | null {
	return null
}
