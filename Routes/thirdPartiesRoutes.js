const express = require("express")
const router = express.Router();
const { geminiChatResponses } = require("../Controller/geminiController");

router.post("/quick-ai", geminiChatResponses);

module.exports = router