const Design = require("../Models/Design");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const { runChat } = require("../ThirdPartiesAPI/GeminiAPI/geminiapi");
const {
  prefixForPrompts,
  randomButtonText,
  FAQsHeader,
  teamHeader,
  featureHeader,
  contactHeader,
  customerHeader,
  statsHeader,
  partnerHeader,
  customerParagraphText,
  teamParagraphText,
  faqParagraphText,
  customerReviewText,
} = require("../Utils/prefixObjects");
const searchImages = require("./unsplashController");

const dummyResponses = {
  logo: "QuickUI",
  heroHeader: "Quickly Design with QuickUI",
  heroDescription: "Lorem ipsum",
  faqQuestions: ["Question 1", "Question 2", "Question 3", "Question 4"],
  faqAnswers:
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
};

const handleAPIError = async (prompt, prefix, index = null) => {
  try {
    return await runChat(prefix + " " + prompt);
  } catch (error) {
    if (
      error.message.includes("429 Too Many Requests") ||
      error.message.includes("503 Service Unavailable")
    ) {
      // Return dummy text if rate limit is hit
      switch (prefix) {
        case prefixForPrompts.promptPrefixLogo:
          return dummyResponses.logo;
        case prefixForPrompts.promptPrefixForHeroHeader:
          return dummyResponses.heroHeader;
        case prefixForPrompts.promptPrefixForHeroDescription:
          return dummyResponses.heroDescription;
        case prefixForPrompts.promptPrefixForFaqQuestion:
          if (index !== null && index < dummyResponses.faqQuestions.length) {
            return dummyResponses.faqQuestions[index];
          } else {
            return dummyResponses.faqQuestions[0];
          }
        case prefixForPrompts.promptPrefixForFAQAnswer:
          return dummyResponses.faqAnswers;
        default:
          throw new Error("Unknown prefix");
      }
    } else {
      throw error; // Re-throw the error if it's not a rate limit error
    }
  }
};

const unsplashImage = async (req, res) => {
  try {
    const { prompt } = req.body;

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

    res.status(200).json({
      imageUrls: imageUrlsResponse.imageUrls,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const geminiChatResponses = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Get the response from the Gemini API
    const response = await runChat(prompt);
    res.json({ response });
  } catch (error) {
    console.error("Error with Gemini API:", error);

    if (error.response && error.response.status === 429) {
      // Handle "429 Too Many Requests" error
      res.status(429).json({
        error: "Too Many Requests. Please slow down and try again later.",
      });
    } else if (error.response && error.response.status === 503) {
      // Handle "503 Service Unavailable" error
      res.status(503).json({
        error:
          "Service Unavailable. The server is temporarily unable to handle the request. Please try again later.",
      });
    } else {
      // Handle any other errors
      res.status(500).json({
        error: "Failed to generate response from Gemini API",
      });
    }
  }
};

const landingPageDesign = async (req, res) => {
  try {
    const { prompt, style, webDesignImagePreview } = req.body;

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).send({ error: "Please Login" });
    }

    const accessToken = authHeader.split(" ")[1]; // Extract the token

    const verified = jwt.verify(accessToken, process.env.JWT_SECRET);
    const userId = verified.user;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    // Check the user's trials count and subtract 1 if greater than 0
    if (user.trials > 0) {
      user.trials -= 1;
      await user.save();
    }

    // Find the Design document by userId
    let userDesign = await Design.findOne({ userId });

    // If no Design document exists for this user, create a new one
    if (!userDesign) {
      userDesign = new Design({ userId, promptHistory: [] });
    }

    if (!prompt || prompt.trim() === "") {
      return res.status(400).send({ error: "Empty Prompt" });
    }

    // Push the new design prompt to the promptHistory array
    userDesign.promptHistory.push({
      prompt,
      style,
      webDesignImagePreview,
      createdAt: new Date(),
    });

    // Save the updated Design document
    await userDesign.save();

    res.status(200).send({ message: "saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  geminiChatResponses,
  landingPageDesign,
  unsplashImage,
};
