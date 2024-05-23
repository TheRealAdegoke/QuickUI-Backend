const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const { runChat } = require("../ThirdPartiesAPI/GeminiAPI/geminiapi");
const {
  prefixForPrompts,
  randomButtonText,
} = require("../Utils/prefixObjects");
const searchImages = require("./unsplashController");

const geminiChatResponses = async (req, res) => {
  try {
    const { prompt } = req.body;
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(400).send({ error: "Please Login" });
    }

    if (prompt.trim() === "") {
      return res.status(400).send({
        error: "Empty Prompt",
      });
    }

    if (prompt.length < 5) {
      return res
        .status(400)
        .send({ error: "Prompt should contain at least 5 words" });
    }

    // Call searchImages function with the prompt
    let imageUrlsResponse;
    try {
      imageUrlsResponse = await searchImages({ body: { prompt } }, res);
    } catch (error) {
      // Handle the error from searchImages
      return res.status(404).send({ error: error.message });
    }

    let promptResponseForLogo,
      promptResponseForHeroHeader,
      promptResponseForHeroDescription;

    try {
      promptResponseForLogo = await runChat(
        prefixForPrompts.promptPrefixLogo + " " + prompt
      );
    } catch (error) {
      console.error("Error generating logo:", error);
      promptResponseForLogo = "QuickUI"; // Fallback response
    }

    try {
      promptResponseForHeroHeader = await runChat(
        prefixForPrompts.promptPrefixForHeroHeader + " " + prompt
      );
    } catch (error) {
      if (error.message.includes("500 Internal Server Error")) {
        console.error("Rate limit error for hero header:", error);
        promptResponseForHeroHeader = "Quick Design With QuickUI"; // Fallback response for rate limit error
      } else {
        throw error;
      }
    }

    try {
      promptResponseForHeroDescription = await runChat(
        prefixForPrompts.promptPrefixForHeroDescription + " " + prompt
      );
    } catch (error) {
      console.error("Error generating hero description:", error);
      promptResponseForHeroDescription =
        "Tell your visitors more about what you do and why they should chose you."; // Fallback response
    }

    const faqHeaders = [];
    const faqAnswers = [];
    const fallbackFAQHeaders = [
      "Question 1",
      "Question 2",
      "Question 3",
      "Question 4",
    ];


    for (let i = 0; i < 4; i++) {
      let faqHeader, faqAnswer;

      try {
        faqHeader = await runChat(
          prefixForPrompts.promptPrefixForFAQHeader + " " + prompt
        );
        faqHeaders.push(faqHeader);
      } catch (error) {
        console.error("Error generating FAQ header:", error);
        res.status(500).send({error: "QuickAI is at capacity, Default contents will be generated"})
        faqHeaders.push(fallbackFAQHeaders[i]); // Fallback response
      }

      try {
        faqAnswer = await runChat(
          prefixForPrompts.promptPrefixForFAQAnswer + " " + faqHeader
        );
        faqAnswers.push(faqAnswer);
      } catch (error) {
        console.error("Error generating FAQ answer:", error);
        faqAnswers.push(
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa."
        ); // Fallback response
      }
    }

    res.status(200).json({
      randomButtonText: randomButtonText,
      logo: promptResponseForLogo,
      heroHeader: promptResponseForHeroHeader,
      heroDescription: promptResponseForHeroDescription,
      faqHeaders: faqHeaders,
      faqAnswers: faqAnswers,
      imageUrls: imageUrlsResponse.imageUrls,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const landingPageDesign = async (req, res) => {
  try {
    const { prompt, navStyle, heroStyle, webDesignImagePreview } = req.body;

    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(400).send({ error: "Please Login" });
    }

    const verified = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = verified.user;
    const getUserData = await User.findById(user);

    if (prompt.trim() === "") {
      return res.status(400).send({
        error: "Empty Prompt",
      });
    }

    getUserData.promptHistory.push({
      prompt,
      navStyle,
      heroStyle,
      webDesignImagePreview,
      createdAt: new Date(),
    });
    await getUserData.save();

    res.status(200).send({ message: "saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  geminiChatResponses,
  landingPageDesign,
};
