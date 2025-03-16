import { useState, useEffect } from "react";
import axios from "axios";

const LiveTranslation = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputLanguage, setInputLanguage] = useState("en"); // Default: English
  const [outputLanguage, setOutputLanguage] = useState("hi"); // Default: Hindi
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get("https://lingva-translate-drab-sigma.vercel.app/api/v1/languages");
        setLanguages(response.data.languages || []); // Ensure proper mapping
      } catch (error) {
        console.error("Error fetching languages", error);
      }
    };
    fetchLanguages();
  }, []);

  const translateText = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://lingva-translate-drab-sigma.vercel.app/api/v1/${inputLanguage}/${outputLanguage}/${encodeURIComponent(text)}`
      );
      setTranslatedText(response.data.translation || "Translation failed");
    } catch (error) {
      console.log(error)
      setTranslatedText("Error translating text");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4 p-4 shadow-lg rounded" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-3">Live Translation</h2>
      <div className="mb-3">
        <label className="form-label">Input Language:</label>
        <select
          className="form-select"
          value={inputLanguage}
          onChange={(e) => setInputLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows="3"
          placeholder="Enter text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Output Language:</label>
        <select
          className="form-select"
          value={outputLanguage}
          onChange={(e) => setOutputLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary w-100" onClick={translateText} disabled={loading}>
        {loading ? "Translating..." : "Translate"}
      </button>
      <div className="mt-3">
        <label className="form-label">Translated Text:</label>
        <textarea
          className="form-control"
          rows="3"
          readOnly
          value={translatedText}
        />
      </div>
    </div>
  );
};

export default LiveTranslation;
