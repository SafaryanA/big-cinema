export function daysUntil(date: string): number {
	const now = new Date()
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	const [ry, rm, rd] = date.split('-').map(Number)
	const target = new Date(ry, rm - 1, rd)

	return Math.round(
		(target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
	)
}
