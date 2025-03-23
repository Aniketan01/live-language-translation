const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://live-language-translation.vercel.app", // ✅ Allow only your frontend
    credentials: true, // ✅ Allows cookies and authentication headers
  })
);

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/voice-translate";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: String, // Insecure storage for simplicity
});

const TranslationSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Store username instead of ObjectId
  text: { type: String, required: true },
  translatedText: { type: String, required: true },
  inputLanguage: { type: String, required: true },
  outputLanguage: { type: String, required: true },
  type: { type: String, enum: ["text", "voice"], required: true },
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const Translation = mongoose.model("Translation", TranslationSchema);

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.json({ message: "User registered successfully!", user: newUser.username });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.json({ user: user.username });
});

app.post("/store-translation", async (req, res) => {
  const { user, text, translatedText, inputLanguage, outputLanguage, type } = req.body;
  
  if (!user || !text || !translatedText || !inputLanguage || !outputLanguage || !type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const userExists = await User.findOne({ username: user });
  if (!userExists) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const newTranslation = new Translation({ user, text, translatedText, inputLanguage, outputLanguage, type });
    await newTranslation.save();
    res.status(201).json({ message: "Translation saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save translation" });
  }
});

app.get("/translations", async (req, res) => {
  const { user } = req.query;
  if (!user) {
    return res.status(400).json({ error: "Username required" });
  }
  try {
    const translations = await Translation.find({ user }).sort({ timestamp: -1 });
    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch translations" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
