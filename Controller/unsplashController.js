const axios = require("axios");

const searchImages = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Fetch images from Unsplash API
    const response = await axios.get(
      `${process.env.UNSPLASH_API_URL}?query=${encodeURIComponent(
        prompt
      )}&client_id=${process.env.UNSPLASH_API_KEY}`
    );

    // Extract image URLs from the response
    const imageUrls = response.data.results.map(
      (result) => result.urls.regular
    );

    if (!imageUrls || imageUrls.length === 0) {
      throw new Error("Images not found for the given prompt");
    }

    return { imageUrls };
  } catch (error) {
    console.error(error);
    // Throw the error to be caught by the caller (geminiChatResponses)
    throw error;
  }
};

module.exports = searchImages;
