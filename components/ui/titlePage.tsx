import type { TitlePageProps } from '@/@type/ui'

export default function TitlePage({
	title,
	level = 1,
	className = 'title',
}: TitlePageProps) {
	const Tag = `h${level}` as const

	return <Tag className={className}>{title}</Tag>
}
