export function filmHref(slug: string, trailer = false): string {
	return trailer ? `/${slug}?trailer=1` : `/${slug}`
}
