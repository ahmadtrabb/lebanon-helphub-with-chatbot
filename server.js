// 📦 Load environment variables from .env file into process.env
require("dotenv").config();

// 🌐 Import the Express framework for building the web server
const express = require("express");

// 🤖 Import the Google Gen AI SDK to talk to Gemini
const { GoogleGenAI } = require("@google/genai");

// 🚀 Initialize an Express application
const app = express();

// 🧠 Create a new Gen AI client using your API key from the .env file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ⚙️ Tell Express to parse incoming JSON request bodies
app.use(express.json());

// 📂 Serve all static files (HTML, CSS, JS) from the "public" folder
app.use(express.static("public"));

// 🧾 System instruction that defines Amal's persona — warm, knowledgeable, Lebanon-focused
const SYSTEM_INSTRUCTION = `
You are Amal, a warm, knowledgeable AI assistant inside the Lebanon Help Hub app.
You help people in Lebanon find practical help and information — things like
NGOs, food and medical aid, legal support, shelters, mental health resources,
and community services. Give clear, concise, and respectful answers, and when
possible mention the type of organization or service the user should look for
(even if you can't give a live phone number or address). Be encouraging and
non-judgmental, since people may be reaching out during a difficult time.
`;

// 💬 POST /api/chat — main endpoint for chatting with Amal
app.post("/api/chat", async (req, res) => {
  try {
    // Extract the user's message from the request body
    const { message } = req.body;

    // Make sure a message was actually provided
    if (!message) {
      return res.status(400).json({ reply: "Please provide a message." });
    }

    // 🧪 Send the user's message to Gemini 2.5 Flash with Amal's system instruction
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    // Extract the text reply from Gemini's response
    const reply = response.text;

    // ✅ Send the reply back to the user as JSON
    res.json({ reply });
  } catch (error) {
    // ❌ If anything goes wrong, log it and return a friendly error message
    console.error("❌ Error chatting with Gemini:", error.message);
    res.status(500).json({
      reply: "Sorry, something went wrong. Please try again later.",
    });
  }
});

// 🚦 Start the server on port 3000 and log a success message
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Lebanon Help Hub AI is running at http://localhost:${PORT}`);
});