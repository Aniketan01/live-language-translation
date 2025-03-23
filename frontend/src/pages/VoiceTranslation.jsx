import { useState, useEffect } from "react";
import axios from "axios";

const VoiceTranslation = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputLanguage, setInputLanguage] = useState("en");
  const [outputLanguage, setOutputLanguage] = useState("hi");
  const [languages, setLanguages] = useState([]);
  const [voices, setVoices] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios
      .get("https://lingva-translate-drab-sigma.vercel.app/api/v1/languages")
      .then((res) => setLanguages(res.data.languages || []))
      .catch((err) => console.error("Error fetching languages", err));

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleVoiceInput = () => {
    const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.lang = inputLanguage;
    
    recognition.onresult = (e) => {
      setText(e.results[0][0].transcript);
    };

    recognition.onend = () => {
      translateText(); // 🔥 Automatically translate after voice input
    };

    recognition.start();
  };

  const translateText = async () => {
    if (!text.trim()) return;
    setLoading(true);
  
    try {
      const res = await axios.get(
        `https://lingva-translate-drab-sigma.vercel.app/api/v1/${inputLanguage}/${outputLanguage}/${encodeURIComponent(text)}`
      );
  
      const translation = res.data.translation || "Translation failed";
      setTranslatedText(translation);
  
      // ✅ Retrieve user ID from localStorage
      const user = localStorage.getItem("user");
      if (!user) {
        console.error("User is missing from localStorage");
        return;
      }
  
      const parsedUser = JSON.parse(user);
      if (!parsedUser.username) {
        console.error("Invalid user object in localStorage");
        return;
      }
  
      // ✅ Store translation in database with correct user field
      await axios.post(`${API_BASE_URL}/store-translation`, {
        user: parsedUser.username, // Extract username correctly
        text,
        translatedText: translation,
        inputLanguage,
        outputLanguage,
        type: "voice",
      });
  
      console.log("Translation successfully stored!");
    } catch (error) {
      console.error("Error in Translation or Storing:", error);
      setTranslatedText("Error translating text");
    }
  
    setLoading(false);
  };
  

  const speakTranslation = () => {
    if (!translatedText) return;
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.voice = voices.find((v) => v.lang.startsWith(outputLanguage)) || null;
    synth.speak(utterance);
  };

  return (
    <div className="container mt-4 p-4 shadow-lg rounded" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-3">Voice Translation</h2>

      <div className="mb-3">
        <label className="form-label">Input Language:</label>
        <select className="form-select" value={inputLanguage} onChange={(e) => setInputLanguage(e.target.value)}>
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      <textarea className="form-control mb-3" rows="3" value={text} placeholder="Recognized Speech" onChange={(e) => setText(e.target.value)} />

      <button className="btn btn-primary w-100 mb-3" onClick={handleVoiceInput}>
        Speak Now
      </button>

      <div className="mb-3">
        <label className="form-label">Output Language:</label>
        <select className="form-select" value={outputLanguage} onChange={(e) => setOutputLanguage(e.target.value)}>
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-success w-100 mb-3" onClick={translateText} disabled={loading}>
        {loading ? "Translating..." : "Translate"}
      </button>

      <textarea className="form-control mb-3" rows="3" value={translatedText} placeholder="Translated Text" readOnly />

      {translatedText && (
        <button className="btn btn-warning w-100" onClick={speakTranslation}>
          Play Translation
        </button>
      )}
    </div>
  );
};

export default VoiceTranslation;
