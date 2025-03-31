import { useEffect, useState } from "react";
import { getWords } from "../services/api";
import WordCard from "../components/WordCard";
import "../styles/Learning.css";

function Learning() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getWords();
      setWords(data);
    }
    fetchData();
  }, []);

  return (
    <div className="learning-container">
      <h1>📖 Aprende nuevas palabras</h1>
      <div className="words-grid">
        {words.length > 0 ? (
          words.map(word => <WordCard key={word.id} word={word} />)
        ) : (
          <p>Cargando palabras...</p>
        )}
      </div>
    </div>
  );
}

export default Learning;
