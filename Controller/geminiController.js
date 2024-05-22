const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const { runChat } = require("../ThirdPartiesAPI/GeminiAPI/geminiapi");
const {
  prefixForPrompts,
  randomButtonText,
} = require("../Utils/prefixObjects");
const searchImages = require("./unsplashController");
const { runChatBackup } = require("../ThirdPartiesAPI/GeminiAPI/geminiapibackup");

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
      promptResponsesForDescription = [],
      promptResponsesForSectionHeaders = [];

    try {
      promptResponseForLogo = await runChat(
        prefixForPrompts.promptPrefixLogo + " " + prompt
      );
    } catch (error) {
      console.error("Error generating logo:", error);
      promptResponseForLogo = "Default logo text"; // Fallback response
    }

    try {
      promptResponseForHeroHeader = await runChat(
        prefixForPrompts.promptPrefixForHeroHeader + " " + prompt
      );
    } catch (error) {
      if (error.message.includes("500 Internal Server Error")) {
        console.error("Rate limit error for hero header:", error);
        promptResponseForHeroHeader = "Your header Text"; // Fallback response for rate limit error
      } else {
        throw error; // Rethrow if it's not the rate limit error
      }
    }

    // Generate multiple hero descriptions
    const numberOfDescriptions = 12;
    for (let i = 0; i < numberOfDescriptions; i++) {
      try {
        const response = await runChatBackup(
          prefixForPrompts.promptPrefixForDescription + " " + prompt
        );
        promptResponsesForDescription.push(response);
      } catch (error) {
        console.error("Error generating hero description:", error);
        promptResponsesForDescription.push(
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum labore iure hic nemo ipsam totam veritatis provident et aut quae?"
        ); // Fallback response
      }
    }

    // Generate multiple hero descriptions
    // const numberOfSectionHeaders = 5;
    // for (let i = 0; i < numberOfSectionHeaders; i++) {
    //   try {
    //     const response = await runChat(
    //       prefixForPrompts.promptPrefixForSectionHeader + " " + prompt
    //     );
    //     promptResponsesForSectionHeaders.push(response);
    //   } catch (error) {
    //     console.error("Error generating hero description:", error);
    //     promptResponsesForSectionHeaders.push(
    //       "Your Amazing Feature Goes Here",
    //     ); // Fallback response
    //   }
    // }

    res.status(200).json({
      // randomButtonText: randomButtonText,
      // logo: promptResponseForLogo,
      headers: promptResponseForHeroHeader,
      descriptions: promptResponsesForDescription,
      // sectionHeader: promptResponsesForSectionHeaders,
      // imageUrls: imageUrlsResponse.imageUrls,
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
  landingPageDesign
};
