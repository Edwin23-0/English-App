import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png'; // ajusta la ruta si es necesario

const Footer = () => {
  return (
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
        </section>
        <section className="footer-social-section">
          <h3 className="footer-section-title">Síguenos</h3>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </section>
      </div>
      <div className="footer-copyright">
        <p>© {new Date().getFullYear()} English Web. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
