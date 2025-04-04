import { Link } from "react-router-dom";
import "./../styles/Home.css";
import Lottie from "lottie-react";
import englishAnimation from "../assets/animation.json"; // Asegúrate de tener esta animación

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="logo">English App</div>
                <div className="nav-links">
                    <Link to="/docs">Docs</Link>
                    <Link to="/forum">Forum</Link>
                    <Link to="/login">Login</Link>
                </div>
            </nav>
            <div className="content">
                <div className="text-section">
                    <h1>Learning is easier with <span className="highlight">English App</span></h1>
                    <p>Improve your vocabulary with our intelligent spaced repetition system.</p>
                    <Link to="/learning">
                        <button className="start-btn">Start Learning</button>
                    </Link>
                </div>
                <div className="app-logo">
                    <div className="lottie-wrapper">
                        <Lottie animationData={englishAnimation} loop={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
