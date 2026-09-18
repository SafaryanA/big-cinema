const YOUTUBE =
	/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/

export function youTubeId(url: string): string | null {
	return url.match(YOUTUBE)?.[1] ?? null
}

export function youTubeEmbed(id: string, startTime = 0): string {
	const start = startTime > 0 ? `&start=${Math.floor(startTime)}` : ''

	return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1${start}`
}
