import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./../styles/Home.css";
import Lottie from "lottie-react";
import englishAnimation from "../assets/animation.json";

const Home: React.FC = () => {
    const [user, setUser] = useState<{ nombre: string } | null>(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Error al leer el usuario del localStorage", error);
            localStorage.removeItem("user");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="logo">English Web</div>
                <div className="nav-links">
                    <Link to="/docs">Docs</Link>
                    <Link to="/forum">Forum</Link>
                    {user ? (
                        <div className="user-section">
                            <span className="username">{user.nombre}</span>
                            <span className="separator"></span>
                            <span className="logout" onClick={handleLogout}>Cerrar sesión</span>
                        </div>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </nav>
            <div className="content">
                <div className="text-section">
                    <h1>Learning is easier with <span className="highlight">English Web</span></h1>
                    <p className="description-text">Improve your vocabulary with our intelligent spaced repetition system.</p>
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
