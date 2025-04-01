import "./../styles/Home.css";
import logo from "./../assets/logo.svg";

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="logo">English App</div>
                <div className="nav-links">
                    <a href="#">Docs</a>
                    <a href="#">Forum</a>
                    <a href="#">Login</a>
                </div>
            </nav>
            <div className="content">
                <div className="text-section">
                    <h1>Learning is easier with <span className="highlight">English App</span></h1>
                    <p>Improve your vocabulary with our intelligent spaced repetition system.</p>
                    <button className="start-btn">Start Learning</button>
                </div>
                <img src={logo} alt="App Logo" className="app-logo" />
            </div>
        </div>
    );
};

export default Home;
