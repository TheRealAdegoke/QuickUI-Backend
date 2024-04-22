const express = require("express")
const router = express.Router();
const { geminiChatResponses } = require("../Controller/geminiController");

router.post("/gemini-chat-responses", geminiChatResponses);

module.exports = router