import { useState, useEffect } from "react";
import axios from "axios";

const History = () => {
  const [textTranslations, setTextTranslations] = useState([]);
  const [voiceTranslations, setVoiceTranslations] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_RENDER_API || "http://localhost:5000";

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        // ✅ Retrieve and parse user from localStorage
        const user = localStorage.getItem("user");
        if (!user) {
          console.error("User not found in localStorage");
          return;
        }

        const parsedUser = JSON.parse(user);
        if (!parsedUser.username) {
          console.error("Invalid user object in localStorage");
          return;
        }

        // ✅ Send the correct username in API request
        const response = await axios.get(`${API_BASE_URL}/translations?user=${parsedUser.username}`);

        if (!response.data || response.data.length === 0) {
          console.warn("No translations found.");
        }

        // Separate text and voice translations
        const textData = response.data.filter((t) => t.type === "text");
        const voiceData = response.data.filter((t) => t.type === "voice");

        setTextTranslations(textData);
        setVoiceTranslations(voiceData);
      } catch (error) {
        console.error("Error fetching translations", error);
      }
    };

    fetchTranslations();
  }, []);

  return (
    <div className="container mt-4 p-4 shadow-lg rounded">
      <h2 className="text-center mb-3">Translation History</h2>

      <div className="row">
        {/* Text Translations - Left Column */}
        <div className="col-md-6">
          <h4 className="text-primary">📝 Text Translations</h4>
          {textTranslations.length === 0 ? (
            <p>No text translations found.</p>
          ) : (
            <ul className="list-group">
              {textTranslations.map((t) => (
                <li key={t._id} className="list-group-item">
                  <p><strong>Original:</strong> {t.text}</p>
                  <p><strong>Translated:</strong> {t.translatedText}</p>
                  <p><strong>From:</strong> {t.inputLanguage} → <strong>To:</strong> {t.outputLanguage}</p>
                  <p><small><strong>Timestamp:</strong> {new Date(t.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</small></p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Voice Translations - Right Column */}
        <div className="col-md-6">
          <h4 className="text-success">🎤 Voice Translations</h4>
          {voiceTranslations.length === 0 ? (
            <p>No voice translations found.</p>
          ) : (
            <ul className="list-group">
              {voiceTranslations.map((t) => (
                <li key={t._id} className="list-group-item">
                  <p><strong>Original:</strong> {t.text}</p>
                  <p><strong>Translated:</strong> {t.translatedText}</p>
                  <p><strong>From:</strong> {t.inputLanguage} → <strong>To:</strong> {t.outputLanguage}</p>
                  <p><small><strong>Timestamp:</strong> {new Date(t.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</small></p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
