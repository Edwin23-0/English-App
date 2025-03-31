import { useEffect, useState } from "react";
import WordCard from "../components/WordCard";
import { fetchWord } from "../services/api";
import "../styles/Learning.css";

function Learning() {
    const [words, setWords] = useState([]);

    useEffect(() => {
        fetchWord().then((data) => {
            if (data) {
                setWords([data]); // Adaptamos a la respuesta de la API
            }
        });
    }, []);

    return (
        <div className="learning-container">
            <h1>Aprende nuevas palabras</h1>
            <div className="word-list">
                {words.length > 0 ? (
                    words.map((word) => <WordCard key={word.id} word={word} />)
                ) : (
                    <p>Cargando palabras...</p>
                )}
            </div>
        </div>
    );
}

export default Learning;
