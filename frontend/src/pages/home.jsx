import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>Bienvenido a English App</h1>
            <p>La primera fase de vocabulario tiene 70 palabras para aprender.</p>
            <button onClick={() => navigate("/learning")} className="start-btn">
                ¡Comenzar!
            </button>
        </div>
    );
}

export default Home;
