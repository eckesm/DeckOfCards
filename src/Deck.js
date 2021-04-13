import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';
import './Deck.css';

const Deck = ({ deckCount = 1 }) => {
	const [ deckId, setDeckId ] = useState(null);
	const [ cards, setCards ] = useState([]);
	const [ remaining, setRemaining ] = useState(null);

	useEffect(
		() => {
			async function getNewDeck() {
				const res = await axios.get(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${deckCount}`);
				setDeckId(res.data.deck_id);
				setCards([]);
				setRemaining(res.data.remaining);
			}
			getNewDeck();
		},
		[ deckCount ]
	);

	async function drawCard() {
		const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1
    `);
		const newCard = res.data.cards[0];
		setRemaining(res.data.remaining);
		// const leftOffset = (deckCount * 52 - res.data.remaining + 1) * 30;
		const leftOffset = ((deckCount * 52 - res.data.remaining - 1) % 13) * 30 + 25;
		const topOffset = (deckCount * 52 / 13 - Math.floor(res.data.remaining / 13)) * 90;
		setCards(cards => [ ...cards, { ...newCard, leftOffset: leftOffset, topOffset: topOffset } ]);
	}

	const components = cards.map(card => (
		<Card
			id={card.code}
			key={card.code}
			image={card.image}
			value={card.value}
			suit={card.suit}
			leftOffset={card.leftOffset}
			topOffset={card.topOffset}
		/>
	));

	return (
		<div className="Deck">
			{!deckId && <h3>...loading new deck...</h3>}
			{deckId &&
			remaining !== 0 && (
				<button className="Deck-drawCard_button" onClick={drawCard}>
					Draw a card from deck!
				</button>
			)}
			{deckId && remaining === 0 && <h3>There are no cards remaining!</h3>}

			<div className="Deck-cards_played">{components}</div>
		</div>
	);
};

export default Deck;
