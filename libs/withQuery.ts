export function withQuery(pathname: string, query: string): string {
	return query ? `${pathname}?${query}` : pathname
}
