const User = require("../Models/User");
const Design = require("../Models/Design");
const jwt = require("jsonwebtoken");

const userData = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).send({ error: "Please Login" });
    }

    const verified = jwt.verify(accessToken, process.env.JWT_SECRET);
    const userId = verified.user;
    const getUserData = await User.findById(userId);
    const getDesignData = await Design.findOne({ userId });

    if (!getUserData) {
      return res.status(400).send({ error: "Invalid User" });
    }

    if (!getDesignData) {
      return res.status(200).json({
        fullname: getUserData.fullName,
        email: getUserData.email,
        history: [], // If no design data, return empty history
      });
    }

    return res.status(200).json({
      fullname: getUserData.fullName,
      email: getUserData.email,
      history: getDesignData.promptHistory,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getPromptHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).send({ error: "Please Login" });
    }

    const verified = jwt.verify(accessToken, process.env.JWT_SECRET);
    const userId = verified.user;
    const getDesignData = await Design.findOne({ userId });

    if (!getDesignData) {
      return res.status(400).send({ error: "Invalid User" });
    }

    // Find the promptHistory item by its _id
    const promptHistoryItem = getDesignData.promptHistory.find(
      (item) => item._id.toString() === id
    );

    if (!promptHistoryItem) {
      return res.status(404).json({ error: "Prompt history item not found" });
    }

    // Return the promptHistory item
    return res.status(200).json(promptHistoryItem);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  userData,
  getPromptHistoryById,
};