export function imageSrc(path: string): string {
	return /^https?:\/\//.test(path) ? path : `/images${path}`
}
