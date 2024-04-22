const { runChat } = require("../ThirdPartiesAPI/GeminiAPI/geminiapi");
const prefixForPrompts = require("../Utils/prefixObjects");
const searchImages = require("./unsplashController");

const geminiChatResponses = async (req, res) => {
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

    const promptResponseForHeroHeader = await runChat(
      prefixForPrompts.promptPrefixForHeroHeader + " " + prompt
    );

    const promptResponseForHeroDescription = await runChat(
      prefixForPrompts.promptPrefixForHeroDescription + " " + prompt
    );

    res.status(200).json({
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
