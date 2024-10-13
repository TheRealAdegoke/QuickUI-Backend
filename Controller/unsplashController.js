const axios = require("axios");

const searchImages = async (req, res) => {
  try {
    const { prompt } = req.body;

    const perPage = 30; // Unsplash allows a maximum of 30 results per page
    const maxImages = 54; // We want to get up to 50 images
    let imageUrls = [];

    // Fetch the first batch of images (up to 30)
    const responsePage1 = await axios.get(
      `${process.env.UNSPLASH_API_URL}?query=${encodeURIComponent(
        prompt
      )}&per_page=${perPage}&client_id=${process.env.UNSPLASH_API_KEY}`
    );

    imageUrls = responsePage1.data.results.map((result) => result.urls.regular);

    // If less than maxImages were fetched and more images are needed, fetch the second page
    if (imageUrls.length < maxImages) {
      const responsePage2 = await axios.get(
        `${process.env.UNSPLASH_API_URL}?query=${encodeURIComponent(
          prompt
        )}&page=2&per_page=${maxImages - imageUrls.length}&client_id=${
          process.env.UNSPLASH_API_KEY
        }`
      );

      const moreImageUrls = responsePage2.data.results.map(
        (result) => result.urls.regular
      );

      imageUrls = imageUrls.concat(moreImageUrls); // Merge the two lists of images
    }

    if (!imageUrls || imageUrls.length === 0) {
      throw new Error("Images not found for the given prompt");
    }

    return { imageUrls };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = searchImages;
