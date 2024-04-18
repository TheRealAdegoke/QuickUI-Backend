// Import necessary modules
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// Define your API key and other constants
const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.GEMINI_API;

// Define a function to send prompt to Gemini API and receive response
async function runChat(prompt) {
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

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  return response.text();
}

// Export the function for use in other files
module.exports = { runChat };
