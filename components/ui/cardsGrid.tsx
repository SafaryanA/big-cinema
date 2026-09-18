import type { CardView } from '@/@type/item'
import CardItem from '../shared/cardItem'

export default function CardsGrid({ cards }: { cards: CardView[] }) {
	return (
		<div className='container_body'>
			<div className='grid-films-card-wrapper'>
				<div className='grid-films-card'>
					{cards.map(card => (
						<CardItem key={card.id} item={card} />
					))}
				</div>
			</div>
		</div>
	)
}
