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

    const verified = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = verified.user;
    const getUserData = await User.findById(user);

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

    getUserData.promptHistory.push({
      prompt,
      createdAt: new Date(),
    });
    await getUserData.save();

    // Call searchImages function with the prompt
    let imageUrlsResponse;
    try {
      imageUrlsResponse = await searchImages({ body: { prompt } }, res);
    } catch (error) {
      // Handle the error from searchImages
      return res.status(404).send({ error: error.message });
    }

    const promptResponseForLogo = await runChat(
      prefixForPrompts.promptPrefixLogo + " " + prompt
    );

    const promptResponseForHeroHeader = await runChat(
      prefixForPrompts.promptPrefixForHeroHeader + " " + prompt
    );

    const promptResponseForHeroDescription = await runChat(
      prefixForPrompts.promptPrefixForHeroDescription + " " + prompt
    );

    res.status(200).json({
      randomButtonText: randomButtonText,
      logo: promptResponseForLogo,
      heroHeader: promptResponseForHeroHeader,
      heroDescription: promptResponseForHeroDescription,
      imageUrls: imageUrlsResponse.imageUrls,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  geminiChatResponses,
};
