import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function fakeStorage(broken = false) {
	const data = new Map<string, string>()

	return {
		getItem: (k: string) => {
			if (broken) throw new Error('хранилище закрыто')

			return data.get(k) ?? null
		},
		setItem: (k: string, v: string) => {
			if (broken) throw new Error('места нет')

			data.set(k, v)
		},
		removeItem: (k: string) => void data.delete(k),
		clear: () => data.clear(),
		key: () => null,
		length: 0,
	} as unknown as Storage
}

async function load(broken = false) {
	globalThis.window = {
		localStorage: fakeStorage(broken),
	} as unknown as Window & typeof globalThis

	vi.resetModules()

	return await import('@/libs/progress')
}

afterEach(() => {
	delete (globalThis as { window?: unknown }).window
})

describe('отметка просмотра', () => {
	let progress: typeof import('@/libs/progress')

	beforeEach(async () => {
		progress = (await load()) as typeof import('@/libs/progress')
	})

	it('без записи отдаёт null', () => {
		expect(progress.getWatchPoint('aurora-chronicles')).toBeNull()
	})

	it('записывает и читает обратно', () => {
		progress.setWatchPoint('aurora-chronicles', {
			season: 2,
			episode: 3,
			time: 120,
		})

		const point = progress.getWatchPoint('aurora-chronicles')

		expect(point?.season).toBe(2)
		expect(point?.episode).toBe(3)
		expect(point?.time).toBe(120)
	})

	it('к записи проставляется время', () => {
		progress.setWatchPoint('a', { season: 1, episode: 1, time: 60 })

		expect(progress.getWatchPoint('a')?.updated).toBeGreaterThan(0)
	})

	it('первые секунды не запоминаются: случайное нажатие не должно стирать место', () => {
		progress.setWatchPoint('a', { season: 1, episode: 1, time: 300 })
		progress.setWatchPoint('a', { season: 1, episode: 1, time: 2 })

		expect(progress.getWatchPoint('a')?.time).toBe(300)
	})

	it('новая запись заменяет прежнюю', () => {
		progress.setWatchPoint('a', { season: 1, episode: 1, time: 60 })
		progress.setWatchPoint('a', { season: 1, episode: 2, time: 90 })

		expect(progress.getWatchPoint('a')?.episode).toBe(2)
	})

	it('фильмы не путаются между собой', () => {
		progress.setWatchPoint('a', { season: 1, episode: 1, time: 60 })
		progress.setWatchPoint('b', { season: 5, episode: 5, time: 600 })

		expect(progress.getWatchPoint('a')?.episode).toBe(1)
		expect(progress.getWatchPoint('b')?.episode).toBe(5)
	})

	it('забывает фильм', () => {
		progress.setWatchPoint('a', { season: 1, episode: 1, time: 60 })
		progress.clearWatchPoint('a')

		expect(progress.getWatchPoint('a')).toBeNull()
	})

	it('забыть несуществующее — не ошибка', () => {
		expect(() => progress.clearWatchPoint('нет-такого')).not.toThrow()
	})

	it('хранилище не растёт без предела: остаются последние 50', () => {
		for (let i = 0; i < 60; i++)
			progress.setWatchPoint(`film-${i}`, {
				season: 1,
				episode: 1,
				time: 60 + i,
			})

		const kept = Array.from({ length: 60 }, (_, i) =>
			progress.getWatchPoint(`film-${i}`),
		).filter(Boolean)

		expect(kept).toHaveLength(50)
		expect(progress.getWatchPoint('film-59')).not.toBeNull()
		expect(progress.getWatchPoint('film-0')).toBeNull()
	})

	it('снимок — строка, а не новый объект: иначе бесконечная перерисовка', () => {
		progress.setWatchPoint('a', { season: 1, episode: 1, time: 60 })

		const first = progress.watchPointSnapshot('a')

		expect(typeof first).toBe('string')
		expect(progress.watchPointSnapshot('a')).toBe(first)
	})

	it('снимок для сервера всегда пустой', () => {
		expect(progress.serverWatchPointSnapshot()).toBeNull()
	})

	it('подписка отдаёт функцию отписки', () => {
		expect(typeof progress.subscribeWatchPoints()).toBe('function')
	})
})

describe('закрытое хранилище', () => {
	it('не роняет страницу: приватное окно, переполнение, запрет данных', async () => {
		const progress = (await load(true)) as typeof import('@/libs/progress')

		expect(() =>
			progress.setWatchPoint('a', { season: 1, episode: 1, time: 60 }),
		).not.toThrow()
		expect(progress.getWatchPoint('a')).toBeNull()
		expect(progress.watchPointSnapshot('a')).toBeNull()
	})
})
