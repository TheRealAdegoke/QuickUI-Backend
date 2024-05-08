const express = require("express")
const router = express.Router();
const { geminiChatResponses, landingPageDesign } = require("../Controller/geminiController");

router.post("/quick-ai", geminiChatResponses);
router.post("/save-landing-styles", landingPageDesign)

module.exports = router