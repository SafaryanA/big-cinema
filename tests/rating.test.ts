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

	return await import('@/libs/rating')
}

afterEach(() => {
	delete (globalThis as { window?: unknown }).window
})

describe('своя оценка', () => {
	let rating: typeof import('@/libs/rating')

	beforeEach(async () => {
		rating = (await load()) as typeof import('@/libs/rating')
	})

	it('без оценки отдаёт null', () => {
		expect(rating.getRating('aurora-chronicles')).toBeNull()
	})

	it('записывает и читает обратно', () => {
		rating.setRating('aurora-chronicles', 9)

		expect(rating.getRating('aurora-chronicles')).toBe(9)
	})

	it('новая оценка заменяет прежнюю', () => {
		rating.setRating('a', 3)
		rating.setRating('a', 8)

		expect(rating.getRating('a')).toBe(8)
	})

	it('фильмы не путаются', () => {
		rating.setRating('a', 1)
		rating.setRating('b', 10)

		expect(rating.getRating('a')).toBe(1)
		expect(rating.getRating('b')).toBe(10)
	})

	it('края шкалы принимаются', () => {
		rating.setRating('a', rating.MIN_RATING)
		expect(rating.getRating('a')).toBe(rating.MIN_RATING)

		rating.setRating('a', rating.MAX_RATING)
		expect(rating.getRating('a')).toBe(rating.MAX_RATING)
	})

	it('вне шкалы не записывается', () => {
		for (const bad of [0, -1, 11, 100]) {
			rating.setRating('a', bad)
			expect(rating.getRating('a')).toBeNull()
		}
	})

	it('дробное и не-число не записываются', () => {
		for (const bad of [7.5, Number.NaN, Number.POSITIVE_INFINITY]) {
			rating.setRating('a', bad)
			expect(rating.getRating('a')).toBeNull()
		}
	})

	it('оценку можно снять', () => {
		rating.setRating('a', 5)
		rating.clearRating('a')

		expect(rating.getRating('a')).toBeNull()
	})

	it('снять несуществующую — не ошибка', () => {
		expect(() => rating.clearRating('нет-такого')).not.toThrow()
	})

	it('подписчик узнаёт о новой оценке', () => {
		let calls = 0
		const off = rating.subscribeRatings(() => calls++)

		rating.setRating('a', 7)
		expect(calls).toBe(1)

		rating.clearRating('a')
		expect(calls).toBe(2)

		off()
		rating.setRating('a', 4)
		expect(calls).toBe(2)
	})

	it('негодная оценка подписчиков не будит', () => {
		let calls = 0

		rating.subscribeRatings(() => calls++)
		rating.setRating('a', 42)

		expect(calls).toBe(0)
	})

	it('снимок для сервера всегда пустой', () => {
		expect(rating.serverRatingSnapshot()).toBeNull()
	})
})

describe('закрытое хранилище', () => {
	it('не роняет страницу', async () => {
		const rating = (await load(true)) as typeof import('@/libs/rating')

		expect(() => rating.setRating('a', 8)).not.toThrow()
		expect(rating.getRating('a')).toBeNull()
	})
})
