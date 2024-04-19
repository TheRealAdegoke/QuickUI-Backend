const express = require("express")
const router = express.Router();
const {
  geminiChatHeroSectionHeader,
  geminiChatHeroSectionDescription,
} = require("../Controller/geminiController");
const searchImages = require("../Controller/unsplashController");

router.post("/gemini-chat-hero-section-header", geminiChatHeroSectionHeader);
router.post("/gemini-chat-hero-section-description", geminiChatHeroSectionDescription);
router.post("/search-image", searchImages);

module.exports = router