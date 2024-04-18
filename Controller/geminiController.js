const {runChat} = require("../ThirdPartiesAPI/GeminiAPI/geminiapi")

const geminiChatHeroSectionHeader = async (req, res) => {
    try {
      const { prompt } = req.body;

      if (prompt.trim() === "") {
        return res.status(400).send({
          error: "Empty Prompt",
        });
      }

      if (prompt.length < 5) {
        return res.status(400).send({error: "Prompt should contain at least 5 words"})
      }

      // Prefix for the prompt
      const promptPrefix =
        "Write a short header not less than 3 words and not more than 4 words without any special characters it must be 4 words for a hero section for";

      // Call runChat function with the prompt
      const promptResponse = await runChat(promptPrefix + " " + prompt);

      // Send the response back to the client
      res.json({ promptResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
}

const geminiChatHeroSectionDescription = async (req, res) => {
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

    // Prefix for the prompt
    const promptPrefix =
      "Write a short description not less than 15 words and not more than 20 words without any special characters for a website";

    // Call runChat function with the prompt
    const promptResponse = await runChat(promptPrefix + " " + prompt);

    // Send the response back to the client
    res.json({ promptResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  geminiChatHeroSectionHeader,
  geminiChatHeroSectionDescription,
};