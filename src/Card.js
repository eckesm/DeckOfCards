import './Card.css';

const Card = ({ id, image, value, suit, leftOffset, topOffset }) => {
	return (
		<img className="Card" style={{ left: leftOffset, top: topOffset }} src={image} alt={`${value} of ${suit}`} />
	);
};

export default Card;
