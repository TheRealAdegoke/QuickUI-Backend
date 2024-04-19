const axios = require("axios");

const searchImages = async (req, res) => {
  try {
    const { prompt } = req.body;
    const IMAGES_PER_PAGE = 10;

    if (prompt.trim() === "") {
      return res.status(400).send({
        error: "Empty Prompt",
      });
    }

    // Fetch images from Unsplash API
    const response = await axios.get(
      `${process.env.UNSPLASH_API_URL}?query=${encodeURIComponent(
        prompt
      )}&client_id=${
        process.env.UNSPLASH_API_KEY
      }`
    );

    // Extract image URLs from the response
    const imageUrls = response.data.results.map(
      (result) => result.urls.regular
    );

    if (!imageUrls || imageUrls.length === 0) {
      return res.status(404).send({
        error: "Images not found for the given prompt",
      });
    }

    // Send the image URLs back to the client
    res.status(200).json({ imageUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = searchImages;
