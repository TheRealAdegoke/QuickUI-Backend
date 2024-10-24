const express = require("express")
const router = express.Router();
const { geminiChatResponses, unsplashImage, landingPageDesign } = require("../Controller/geminiController");
const rateLimit = require("express-rate-limit");

// Apply rate limiter to the /api route (third parties routes)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again after 1 minute",
});

router.post("/quick-ai", apiLimiter, geminiChatResponses);
router.post("/quick-image", apiLimiter, unsplashImage);
router.post("/save-landing-styles", apiLimiter, landingPageDesign)

module.exports = router