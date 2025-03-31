import "../styles/WordCard.css";

function WordCard({ word }) {
  return (
    <div className="word-card">
      <img src={word.imagen_url} alt={word.palabra_en} />
      <p>{word.palabra_en} - {word.palabra_es}</p>
    </div>
  );
}

export default WordCard;
