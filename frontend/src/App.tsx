import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Forum from "./pages/forum";
import Docs from "./pages/Docs";
import Learning from "./pages/Learning";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/learning" element={<Learning />} />
      </Routes>
    </Router>
  );
}

export default App;
