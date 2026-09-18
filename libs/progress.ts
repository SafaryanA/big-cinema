
export interface WatchPoint {
	season: number
	episode: number
	time: number
	updated: number
}

type Store = Record<string, WatchPoint>

const KEY = 'reelo:progress'

const LIMIT = 50

const MIN_TIME = 10

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
	} catch {
	}
}

export function getWatchPoint(slug: string): WatchPoint | null {
	return read()[slug] ?? null
}
export function setWatchPoint(
	slug: string,
	point: Omit<WatchPoint, 'updated'>,
): void {
	if (point.time < MIN_TIME) return

	const store = read()

	store[slug] = { ...point, updated: Date.now() }

	const slugs = Object.keys(store)

	if (slugs.length > LIMIT) {
		slugs
			.sort((a, b) => store[a].updated - store[b].updated)
			.slice(0, slugs.length - LIMIT)
			.forEach(old => delete store[old])
	}

	write(store)
}

export function clearWatchPoint(slug: string): void {
	const store = read()

	if (!(slug in store)) return

	delete store[slug]
	write(store)
}
export function subscribeWatchPoints(): () => void {
	return () => {}
}
export function watchPointSnapshot(slug: string): string | null {
	const point = read()[slug]
	return point ? JSON.stringify(point) : null
}
export function serverWatchPointSnapshot(): string | null {
	return null
}
