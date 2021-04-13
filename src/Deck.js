import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Card from './Card';
import './Deck.css';

const Deck = ({ deckCount = 1 }) => {
	const [ deckId, setDeckId ] = useState(null);
	const [ cards, setCards ] = useState([]);
	const [ drawingCards, setDrawingCards ] = useState(false);
	const [ finished, setFinished ] = useState(false);
	let timerId = useRef(null);

	useEffect(
		() => {
			async function getNewDeck() {
				const res = await axios.get(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${deckCount}`);
				setDeckId(res.data.deck_id);
				setCards([]);
			}
			getNewDeck();
		},
		[ setDeckId, deckCount ]
	);

	const toggleDrawingCards = () => {
		if (finished) {
			alert('There are no cards left in the deck.');
		}
		else {
			setDrawingCards(!drawingCards);
		}
	};

	useEffect(
		() => {
			async function drawCard() {
				const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1
      `);

				const remaining = res.data.remaining;
				const newCard = res.data.cards[0];
				const leftOffset = ((deckCount * 52 - remaining - 1) % 13) * 30 + 25;
				const topOffset = (deckCount * 52 / 13 - Math.floor(remaining / 13)) * 90;

				setCards(cards => [ ...cards, { ...newCard, leftOffset: leftOffset, topOffset: topOffset } ]);

				if (remaining === 0) {
					clearInterval(timerId.current);
					setDrawingCards(false);
					setFinished(true);
				}
			}

			if (drawingCards && !timerId.current) {
				timerId.current = setInterval(async () => {
					await drawCard();
				}, 1000);
			}

			return () => {
				clearInterval(timerId.current);
				timerId.current = null;
			};
		},
		[ drawingCards, setDrawingCards, deckCount, deckId ]
	);

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

			{finished ? (
				<h3>There are no more cards in the deck.</h3>
			) : deckId && (
				<button className="Deck-drawCard_button" onClick={toggleDrawingCards}>
					{drawingCards ? 'Stop' : 'Start'} Drawing Cards from Deck!
				</button>
			)}

			<div className="Deck-cards_played">{components}</div>
		</div>
	);
};

export default Deck;
