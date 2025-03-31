import { useEffect, useState } from "react";


function App() {
    const [words, setWords] = useState([]);

    const fetchWords = () => {
        fetch("http://127.0.0.1:5000/palabra")
            .then((response) => response.json())
            .then((data) => setWords([data])) // Ajustado a la estructura de respuesta
            .catch((error) => console.error("Error al obtener datos:", error));
    };

    useEffect(() => {
        fetchWords();
    }, []);
    

    return (
        <div>
            <h1>English App</h1>
            <div>
                {words.length > 0 ? (
                    words.map(word => (
                        <div key={word.id}>
                            <img src={word.imagen_url} alt={word.palabra_en} width="200" />
                            <p>{word.palabra_en} - {word.palabra_es}</p>
                            <button onClick={() => actualizarRepeticion(1, word.id, "medio")}>
                                Marcar como visto
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Cargando palabras...</p>
                )}
            </div>
        </div>
    );
}

export default App;
