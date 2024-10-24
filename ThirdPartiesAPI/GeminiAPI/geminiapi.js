// GeminiAPI/geminiapi.js
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.GEMINI_API;

// Create a singleton chat instance
let chatInstance = null;

async function initializeChat() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_NONE",
    },
  ];

  chatInstance = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  return chatInstance;
}

async function runChat(prompt, history) {
  if (!chatInstance) {
    await initializeChat();
  }

  const result = await chatInstance.sendMessage(prompt);
  return result.response.text();
}

module.exports = { runChat };
