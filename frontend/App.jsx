import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Learning from "./pages/Learning";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/learning" element={<Learning />} />
            </Routes>
        </Router>
    );
}

export default App;
