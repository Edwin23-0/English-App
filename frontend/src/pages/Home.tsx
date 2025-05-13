import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

import "./../styles/Home.css";
import englishAnimation from "../assets/animation.json";
import logoImg from "../assets/Logo.png";
import repetitionIcon from "../assets/repetition.svg";
import progressIcon from "../assets/progress.svg";
import cameraIcon from "../assets/camera.svg";
import algorithmIcon from "../assets/algoritmo.svg";
import clockIcon from "../assets/clock.svg";
import eyeIcon from "../assets/eye.svg";
import graficIcon from "../assets/grafic.png";
import forgettingIcon from "../assets/Forgetting.png";
import brainIcon from "../assets/brain.png"
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

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // o navigate("/")
  };

  
  const handleStartClick = () => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/learning");
    } else {
      navigate("/login");
    }
  };
  

  return (
    <div className="home-container">
      
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

            <button className="start-btn" onClick={handleStartClick}>
              Start Learning
             </button>
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
            <h2>What is <span className="highlight">Spaced Repetition?</span></h2>
            <p>
              <span className="highlight">Spaced Repetition</span> is an evidence-based learning technique that increases the time intervals between subsequent reviews of previously learned material to exploit the spacing effect. Rather than reviewing information over and over again in a short period of time, spaced repetition schedules reviews at increasing intervals. This takes advantage of the way our memory naturally works, strengthening neural connections each time we successfully record the information after a longer interval.
            </p>
            <p>
            Instead of reviewing information over and over again in a short period of time, spaced repetition schedules reviews at increasing intervals. This takes advantage of the way our memory naturally works, strengthening neural connections each time we successfully recall information after a longer interval.
            </p>
          </div>
        </section>

<section className="how-it-works" data-aos="fade-up">
  <h2>How does <span className="highlight">it work</span></h2>

  <div className="steps-container">
    <div className="step-card">
      <div className="step-content">
        <div className="step-text">
          <h3><span className="highlight">Step 1: </span> Learn new words</h3>
          <p>This method ensures that you review information you are about to forget more frequently, while information you remember well is reviewed less frequently.</p>
        </div>
        <div className="step-image">
          <img src={graficIcon} alt="Step 1" />
        </div>
      </div>
    </div>

    <div className="step-card reverse">
      <div className="step-content">
        <div className="step-image">
          <img src={forgettingIcon} alt="Step 2" />
        </div>
        <div className="step-text">
          <h3><span className="highlight">Step 2: </span>  Review smartly</h3>
          <p>The forgetting curve and how spaced repetition helps counteract it and the importance of implementing it daily</p>
        </div>
      </div>
    </div>

    <div className="step-card">
      <div className="step-content">
        <div className="step-text">
          <h3><span className="highlight">Step 3: </span>  Master & Retain</h3>
          <p>Once you consistently recall words, they appear less often, so you focus only on what matters — the words you need most.</p>
        </div>
        <div className="step-image">
          <img src={brainIcon}alt="Step 3" />
        </div>
      </div>
    </div>
  </div>
</section>


        </div>
     
  );
};

export default Home;