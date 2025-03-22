// @ts-check
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(mongoURI || "mongodb://localhost:27017/voice-translate", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // Plain text (Not secure but as per your request)
});

const TranslationSchema = new mongoose.Schema({
  text: String,
  translatedText: String,
  inputLanguage: String,
  outputLanguage: String,
  timestamp: { type: Date, default: () => new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) }
});

const User = mongoose.model("User", UserSchema);
const Translation = mongoose.model("Translation", TranslationSchema);

// Register User
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({ username, email, password });

  try {
    await newUser.save();
    res.json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login User
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ username: user.username });
});

// Store Translation
app.post("/store-translation", async (req, res) => {
  const { text, translatedText, inputLanguage, outputLanguage } = req.body;
  const newTranslation = new Translation({ text, translatedText, inputLanguage, outputLanguage });

  try {
    await newTranslation.save();
    res.json({ message: "Translation stored successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error storing translation" });
  }
});

// Get Stored Translations (Sorted by Latest)
app.get("/translations", async (req, res) => {
  try {
    const translations = await Translation.find().sort({ timestamp: -1 });
    res.json(translations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching translations" });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
