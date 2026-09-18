const filmInfo = [
	{ field: 'year', label: 'year', isCategory: true },
	{ field: 'genres', label: 'genres', isCategory: true },
	{ field: 'duration', label: 'duration', isCategory: false },
	{ field: 'subject', label: 'subject', isCategory: false },
	{ field: 'status', label: 'status', isCategory: false },
	{ field: 'translation', label: 'translation', isCategory: false },
	{ field: 'studio', label: 'studio', isCategory: true },
	{ field: 'country', label: 'country', isCategory: true },
	{ field: 'director', label: 'director', isCategory: false },
	{ field: 'actors', label: 'actors', isCategory: false },
] as const
const filmInfoLink = filmInfo
	.filter(info => info.isCategory)
	.map(el => el.field)
export type CategoryField = (typeof filmInfoLink)[number]

export function isCategoryField(value: unknown): value is CategoryField {
	return typeof value === 'string' && filmInfoLink.some(f => f === value)
}

export { filmInfo, filmInfoLink }
