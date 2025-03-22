import { useState, useEffect } from "react";
import axios from "axios";

const History = () => {
  const [translations, setTranslations] = useState([]);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/translations");
        setTranslations(response.data);
      } catch (error) {
        console.error("Error fetching translations", error);
      }
    };

    fetchTranslations();
  }, []);

  return (
    <div className="container mt-4 p-4 shadow-lg rounded" style={{ maxWidth: "800px" }}>
      <h2 className="text-center mb-3">Translation History</h2>
      {translations.length === 0 ? (
        <p className="text-center">No translations found.</p>
      ) : (
        <ul className="list-group">
          {translations.map((t) => (
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
  );
};

export default History;
