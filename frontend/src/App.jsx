import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LiveTranslation from "./pages/LiveTranslation";
import VoiceTranslation from "./pages/VoiceTranslation";
import History from "./pages/History";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/text-translate" element={<LiveTranslation />} />
        <Route path="/voice-translate" element={<VoiceTranslation />} />
        <Route path="/history" element={<History />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
