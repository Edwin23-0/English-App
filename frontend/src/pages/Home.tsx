import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import AOS from "aos";
import "aos/dist/aos.css";

import "./../styles/Home.css";
import englishAnimation from "../assets/animation.json";
import logoImg from "../assets/Logo.png";
import repetitionIcon from "../assets/repetition.svg";
import progressIcon from "../assets/progress.svg";
import cameraIcon from "../assets/camera.svg";
import algorithmIcon from "../assets/algoritmo.svg";
import clockIcon from "../assets/clock.svg";
import eyeIcon from "../assets/eye.svg";

const Home: React.FC = () => {
  const [user, setUser] = useState<{ nombre: string } | null>(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });

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
                <span className="separator" />
                <span className="logout" onClick={handleLogout}>Cerrar sesión</span>
              </div>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </nav>

        <main className="content">
          <div className="text-section">
            <h1>
              Learning is easier with <span className="highlight">English Web</span>
            </h1>
            <p className="description-text" style={{ color: 'inherit', textDecoration: 'none' }}>
              Improve your vocabulary with our intelligent spaced repetition system.
            </p>

            <Link to="/learning">
              <button className="start-btn">Start Learning</button>
            </Link>
          </div>

          <div className="app-logo">
            <div className="lottie-wrapper">
              <Lottie animationData={englishAnimation} loop />
            </div>
          </div>
        </main>

        <section className="benefits" data-aos="fade-up">
          <h2>
            Why choose <span className="highlight">English Web</span>
          </h2>

          <div className="benefitCards">
            <div className="card">
              <img src={repetitionIcon} alt="Repetition Icon" className="icon" />
              <h3>Spaced Repetition</h3>
              <span className="highlight">Boost retention with proven techniques.</span>
            </div>
            <div className="card">
              <img src={progressIcon} alt="Progress Icon" className="icon" />
              <h3>Personalized Progress</h3>
              <span className="highlight">Track your vocabulary growth daily.</span>
            </div>
            <div className="card">
              <img src={cameraIcon} alt="Visual Icon" className="icon" />
              <h3>Visual Learning</h3>
              <span className="highlight">Learn with images and examples.</span>
            </div>
          </div>

          <div className="benefitCards">
            <div className="card">
              <img src={algorithmIcon} alt="Algorithm Icon" className="icon" />
              <h3>Special Algorithm</h3>
              <span className="highlight">Spaced repetition is your best aid for progress.</span>
            </div>
            <div className="card">
              <img src={clockIcon} alt="Memory Icon" className="icon" />
              <h3>Better Memory</h3>
              <span className="highlight">The forgetting curve is smaller and you remember the words.</span>
            </div>
            <div className="card">
              <img src={eyeIcon} alt="Fun Icon" className="icon" />
              <h3>Fun Interface</h3>
              <span className="highlight">Enjoy learning with intuitive design.</span>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* NUEVA SECCIÓN: Explicación de Repetición Espaciada                 */}
        {/* ================================================================== */}
        <section className="spaced-repetition-explanation" data-aos="fade-up">
          <div className="spaced-repetition-container">
            <h2>¿Qué es la Repetición Espaciada?</h2>
            <p>
              La <span className="highlight">repetición espaciada</span> es una técnica de aprendizaje basada en la evidencia que incrementa los intervalos de tiempo entre las revisiones posteriores del material aprendido previamente para explotar el efecto de espaciado.
            </p>
            <p>
              En lugar de repasar la información una y otra vez en un corto período de tiempo, la repetición espaciada programa las revisiones en intervalos crecientes. Esto aprovecha la forma en que nuestra memoria funciona naturalmente, fortaleciendo las conexiones neuronales cada vez que recordamos la información con éxito después de un intervalo más largo.
            </p>
            <div className="spaced-repetition-benefits">
              <h3>Beneficios Clave:</h3>
              <ul>
                <li>
                  <span className="highlight">Mayor Retención:</span> Recuerda la información por más tiempo.
                </li>
                <li>
                  <span className="highlight">Aprendizaje Eficiente:</span> Dedica tu tiempo a repasar lo que realmente necesitas recordar.
                </li>
                <li>
                  <span className="highlight">Menos Agotamiento:</span> Las sesiones de estudio son más cortas y efectivas.
                </li>
                <li>
                  <span className="highlight">Comprensión Profunda:</span> Al forzar la recuperación de la memoria, se fortalece la comprensión.
                </li>
              </ul>
            </div>
            <p>
              <span className="highlight">English Web</span> utiliza un algoritmo inteligente de repetición espaciada para optimizar tus sesiones de aprendizaje de vocabulario, asegurando que repases las palabras justo en el momento adecuado para una máxima retención.
            </p>
          </div>
        </section>

        {/* ================================================================== */}
        {/* Pie de Página (Footer) - (El que ya habíamos creado)             */}
        {/* ================================================================== */}
        <footer className="footer" data-aos="fade-up">
          <div className="footer-content">
            <section className="footer-logo-section">
              <img src={logoImg} alt="English Web Logo" className="footer-navbar-logo" />
              <span>English Web</span>
            </section>
            <section className="footer-links-section">
              <h3 className="footer-section-title">Navegación</h3>
              <Link to="/learning">Empezar a Aprender</Link>
              <Link to="/docs">Documentación</Link>
              <Link to="/forum">Foro</Link>
            </section>
            <section className="footer-legal-section">
              <h3 className="footer-section-title">Legal</h3>
              <Link to="/privacy-policy">Política de Privacidad</Link>
              <Link to="/terms-of-service">Términos de Servicio</Link>
              {/* <Link to="/contact">Contacto</Link> */}
            </section>
            <section className="footer-social-section">
              <h3 className="footer-section-title">Síguenos</h3>
              {/* Placeholder para íconos de redes sociales (puedes usar componentes de iconos aquí) */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            </section>
          </div>
          <div className="footer-copyright">
            <p>© {new Date().getFullYear()} English Web. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;