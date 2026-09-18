import { daysUntil } from '@/libs/daysUntil'
import { filmHref } from '@/libs/filmHref'
import { isCategoryField } from '@/libs/filmInfo'
import { youTubeEmbed, youTubeId } from '@/libs/videoSource'
import { withQuery } from '@/libs/withQuery'
import { describe, expect, it } from 'vitest'

describe('filmHref', () => {
	it('обычный адрес фильма', () => {
		expect(filmHref('aurora-chronicles')).toBe('/aurora-chronicles')
	})

	it('адрес с трейлером', () => {
		expect(filmHref('aurora-chronicles', true)).toBe(
			'/aurora-chronicles?trailer=1',
		)
	})
})

describe('withQuery', () => {
	it('без запроса адрес не меняется', () => {
		expect(withQuery('/search', '')).toBe('/search')
	})

	it('запрос приклеивается через вопросительный знак', () => {
		expect(withQuery('/search', 'q=ни')).toBe('/search?q=ни')
	})
})

describe('youTubeId', () => {
	const cases: [string, string | null][] = [
		['https://www.youtube.com/watch?v=xvFZjo5PgG0', 'xvFZjo5PgG0'],
		['https://youtu.be/9bZkp7q19f0', '9bZkp7q19f0'],
		['https://www.youtube.com/embed/kJQP7kiw5Fk', 'kJQP7kiw5Fk'],
		['https://www.youtube.com/shorts/OPf0YbXqDm0', 'OPf0YbXqDm0'],
		['https://www.youtube.com/live/2Vv-BfVoq4g', '2Vv-BfVoq4g'],
		['https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
		['https://www.youtube.com/watch?list=PL123&v=JGwWNGJdvx8', 'JGwWNGJdvx8'],
		['hf_20260621_202529_53066daa.mp4', null],
		['The-Strait-of-Hormuz-is-open..mp4', null],
		['https://example.com/watch?v=xvFZjo5PgG0', null],
	]

	it.each(cases)('%s', (url, expected) => {
		expect(youTubeId(url)).toBe(expected)
	})
})

describe('youTubeEmbed', () => {
	it('без начальной секунды параметра start нет', () => {
		expect(youTubeEmbed('abc12345678')).not.toContain('start=')
	})

	it('секунда округляется вниз и попадает в адрес', () => {
		expect(youTubeEmbed('abc12345678', 91.7)).toContain('&start=91')
	})

	it('встраивается через домен без кук', () => {
		expect(youTubeEmbed('abc12345678')).toMatch(
			/^https:\/\/www\.youtube-nocookie\.com\/embed\/abc12345678\?/,
		)
	})
})

describe('daysUntil', () => {
	const iso = (shift: number) => {
		const d = new Date()

		d.setDate(d.getDate() + shift)

		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
	}

	it('сегодня — ноль', () => {
		expect(daysUntil(iso(0))).toBe(0)
	})

	it('завтра — единица', () => {
		expect(daysUntil(iso(1))).toBe(1)
	})

	it('вчера — минус единица', () => {
		expect(daysUntil(iso(-1))).toBe(-1)
	})

	it('вышедшей считается дата не в будущем', () => {
		expect(daysUntil(iso(-30))).toBeLessThan(0)
	})
})

describe('isCategoryField', () => {
	it('известные разделы каталога', () => {
		expect(isCategoryField('genres')).toBe(true)
		expect(isCategoryField('studio')).toBe(true)
	})

	it('всё остальное — не раздел', () => {
		expect(isCategoryField('trailer')).toBe(false)
		expect(isCategoryField(undefined)).toBe(false)
		expect(isCategoryField(['genres'])).toBe(false)
		expect(isCategoryField(1)).toBe(false)
	})
})
