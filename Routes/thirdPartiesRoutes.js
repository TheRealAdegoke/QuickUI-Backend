const express = require("express")
const router = express.Router();
const {
  geminiChatHeroSectionHeader,
  geminiChatHeroSectionDescription,
} = require("../Controller/geminiController");

router.post("/gemini-chat-hero-section-header", geminiChatHeroSectionHeader);
router.post("/gemini-chat-hero-section-description", geminiChatHeroSectionDescription);

module.exports = router