import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>¡Aprende tus primeras 100 palabras en inglés! 📚</h1>
      <p>Practica con imágenes y mejora tu vocabulario de forma divertida.</p>
      <button onClick={() => navigate("/learning")}>Comenzar</button>
    </div>
  );
}

export default Home;
