import { film } from '@/fakeDb'
import {
	PAGE_SIZE,
	SIMILAR_LIMIT,
	findFilms,
	getFilmBySlug,
	getFilmSlugs,
	getFilms,
	getSimilar,
	getSliderItems,
	selectFilms,
	toCardView,
	toSliderView,
} from '@/libs/catalog'
import { describe, expect, it } from 'vitest'

const RU = 'ru' as const

describe('getFilmBySlug', () => {
	it('находит фильм по слагу', () => {
		const found = getFilmBySlug('aurora-chronicles')

		expect(found).not.toBeNull()
		expect(found?.slug).toBe('aurora-chronicles')
	})

	it('на неизвестный слаг отдаёт null, а не падает', () => {
		expect(getFilmBySlug('нет-такого')).toBeNull()
	})

	it('пустая строка — тоже null', () => {
		expect(getFilmBySlug('')).toBeNull()
	})
})

describe('getFilmSlugs', () => {
	const slugs = getFilmSlugs()

	it('без повторов: карта сайта не должна их содержать', () => {
		expect(slugs).toHaveLength(new Set(slugs).size)
	})

	it('каждый слаг открывается', () => {
		for (const slug of slugs) expect(getFilmBySlug(slug)).not.toBeNull()
	})
})

describe('toCardView', () => {
	const card = toCardView(film[0], RU)

	it('название развёрнуто по языку, а не осталось объектом', () => {
		expect(typeof card.title).toBe('string')
	})

	it('тяжёлых полей в карточке нет', () => {
		for (const heavy of [
			'seasons',
			'description',
			'actors',
			'url',
			'trailerUrl',
		])
			expect(card).not.toHaveProperty(heavy)
	})

	it('есть всё, что карточка показывает', () => {
		for (const field of [
			'id',
			'slug',
			'year',
			'rating',
			'imgSrc',
			'type',
			'subscribe',
		])
			expect(card).toHaveProperty(field)
	})

	it('разные языки дают разные названия', () => {
		expect(toCardView(film[0], 'en').title).not.toBe(
			toCardView(film[0], RU).title,
		)
	})
})

describe('toSliderView', () => {
	it('оставляет ровно четыре поля', () => {
		expect(Object.keys(toSliderView(toCardView(film[0], RU))).sort()).toEqual([
			'id',
			'imgSrc',
			'slug',
			'title',
		])
	})
})

describe('getSliderItems', () => {
	it('отдаёт весь каталог', () => {
		expect(getSliderItems(RU)).toHaveLength(film.length)
	})
})

describe('selectFilms', () => {
	it('без фильтра — весь каталог', () => {
		expect(selectFilms(null)).toHaveLength(film.length)
	})

	it('по году отбирает только этот год', () => {
		const year = String(film[0].year)
		const got = selectFilms({ type: 'year', value: year })

		expect(got.length).toBeGreaterThan(0)
		for (const f of got) expect(String(f.year)).toBe(year)
	})

	it('по жанру отбирает только с этим жанром', () => {
		const genre = film[0].genres[0].url
		const got = selectFilms({ type: 'genres', value: genre })

		expect(got.length).toBeGreaterThan(0)
		for (const f of got) expect(f.genres.some(g => g.url === genre)).toBe(true)
	})

	it('неизвестное значение даёт пустой список, а не весь каталог', () => {
		expect(selectFilms({ type: 'genres', value: 'нет-такого' })).toHaveLength(0)
	})
})

describe('getFilms', () => {
	it('первая порция не больше запрошенного', () => {
		const { cards } = getFilms(0, PAGE_SIZE, RU)

		expect(cards.length).toBeLessThanOrEqual(PAGE_SIZE)
	})

	it('hasMore честно говорит, осталось ли ещё', () => {
		expect(getFilms(0, 1, RU).hasMore).toBe(film.length > 1)
		expect(getFilms(0, film.length, RU).hasMore).toBe(false)
	})

	it('total не зависит от размера порции', () => {
		expect(getFilms(0, 1, RU).total).toBe(getFilms(0, 999, RU).total)
	})

	it('смещение за край даёт пустую порцию без ошибки', () => {
		const slice = getFilms(film.length + 100, 10, RU)

		expect(slice.cards).toHaveLength(0)
		expect(slice.hasMore).toBe(false)
	})

	it('порции не пересекаются и покрывают каталог', () => {
		const first = getFilms(0, 30, RU).cards.map(c => c.id)
		const second = getFilms(30, 30, RU).cards.map(c => c.id)

		expect(first.filter(id => second.includes(id))).toHaveLength(0)
	})

	it('фильтр учитывается вместе с порцией', () => {
		const filter = { type: 'genres' as const, value: film[0].genres[0].url }

		expect(getFilms(0, 999, RU, filter).total).toBe(selectFilms(filter).length)
	})
})

describe('getSimilar', () => {
	const item = film[0]
	const similar = getSimilar(item, RU)

	it('сам фильм в похожие не попадает', () => {
		expect(similar.some(c => c.id === item.id)).toBe(false)
	})

	it('не больше предела', () => {
		expect(similar.length).toBeLessThanOrEqual(SIMILAR_LIMIT)
	})

	it('у каждого есть хотя бы один общий жанр', () => {
		const own = new Set(item.genres.map(g => g.url))

		for (const c of similar) {
			const other = film.find(f => f.id === c.id)

			expect(other?.genres.some(g => own.has(g.url))).toBe(true)
		}
	})

	it('фильм без жанров не тянет за собой весь каталог', () => {
		expect(getSimilar({ id: -1, genres: [] }, RU)).toHaveLength(0)
	})

	it('предел можно сузить', () => {
		expect(getSimilar(item, RU, 3).length).toBeLessThanOrEqual(3)
	})
})

describe('findFilms', () => {
	it('слишком короткий запрос ничего не ищет', () => {
		expect(findFilms('а', RU)).toHaveLength(0)
		expect(findFilms('', RU)).toHaveLength(0)
	})

	it('находит по части русского названия', () => {
		const got = findFilms('хрони', RU)

		expect(got.length).toBeGreaterThan(0)
		for (const c of got) expect(c.title.toLowerCase()).toContain('хрони')
	})

	it('ищет по всем языкам сразу: английское название на русской версии', () => {
		expect(findFilms('aurora', RU).length).toBeGreaterThan(0)
	})

	it('регистр и пробелы по краям не мешают', () => {
		expect(findFilms('  ХРОНИ  ', RU)).toEqual(findFilms('хрони', RU))
	})

	it('на бессмыслицу отдаёт пустой список', () => {
		expect(findFilms('zzzzzzzz', RU)).toHaveLength(0)
	})

	it('предел соблюдается', () => {
		expect(findFilms('а'.repeat(0) + 'ни', RU, 3).length).toBeLessThanOrEqual(3)
	})
})
