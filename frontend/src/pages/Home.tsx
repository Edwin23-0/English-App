import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import AOS from 'aos';
import 'aos/dist/aos.css';

import "./../styles/Home.css";
import englishAnimation from "../assets/animation.json";
import logoImg from "../assets/Logo.png"; 

const Home: React.FC = () => {
  const [user, setUser] = useState<{ nombre: string } | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      AOS.init({ duration: 1000 });
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
      <div className="overlay">
        <nav className="navbar">
          <Link to="/" onClick={() => window.location.reload()} className="logo-with-image">
            <img src={logoImg} alt="Logo" className="navbar-logo" />
            <span className="logo">English Web</span>
          </Link>
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
            <h1>
              Learning is easier with <span className="highlight">English Web</span>
            </h1>
            <p className="description-text">
              Improve your vocabulary with our intelligent spaced repetition system.
            </p>
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

        <section className="benefits" data-aos="fade-up">
          <h2>Why choose <span className="highlight">English Web</span></h2>

          <div className="benefitCards">
            <div className="card">
              <img src="src/assets/repetition.svg" alt="Repetition Icon" className="icon" />
              <h3>Spaced Repetition</h3>
              <span className="highlight">Boost retention with proven techniques.</span>
            </div>
            <div className="card">
              <img src="src/assets/progress.svg" alt="Progress Icon" className="icon" />
              <h3>Personalized Progress</h3>
              <span className="highlight">Track your vocabulary growth daily.</span>
            </div>
            <div className="card">
              <img src="src/assets/camera.svg" alt="Visual Icon" className="icon" />
              <h3>Visual Learning</h3>
              <span className="highlight">Learn with images and examples.</span>
            </div>
          </div>

          <div className="benefitCards">
            <div className="card">
              <img src="src/assets/algoritmo.svg" alt="Algoritmo Icon" className="icon" />
              <h3>Special Algorithm</h3>
              <span className="highlight">Spaced repetition is your best aid for progress.</span>
            </div>
            <div className="card">
              <img src="src/assets/clock.svg" alt="Stats Icon" className="icon" />
              <h3>Better Memory</h3>
              <span className="highlight">The forgetting curve is smaller and you remember the words.</span>
            </div>
            <div className="card">
              <img src="src/assets/eye.svg" alt="Fun Icon" className="icon" />
              <h3>Fun Interface</h3>
              <span className="highlight">Enjoy learning with intuitive design.</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
