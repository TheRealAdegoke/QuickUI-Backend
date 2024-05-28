const User = require("../Models/User");
const Design = require("../Models/Design");
const mongoose = require("mongoose")
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
      return res.status(404).send({ error: "Prompt history item not found" });
    }

    // Return the promptHistory item
    return res.status(200).send(promptHistoryItem);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const recreatePromptHistory = async (req, res) => {
  try {
    const { id } = req.params; // assuming the ID is passed as a URL parameter
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
      return res.status(404).send({ error: "Prompt history item not found" });
    }

    // Create a new promptHistory item with the same data but a new _id
    const newPromptHistoryItem = {
      ...promptHistoryItem.toObject(),
      _id: new mongoose.Types.ObjectId(),
      createdAt: Date.now(), // Optionally update the createdAt timestamp
    };

    // Add the new item to the promptHistory array
    getDesignData.promptHistory.push(newPromptHistoryItem);

    // Save the updated document
    await getDesignData.save();

    // Return the updated document
    return res.status(200).send({message: "History duplicated"});
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const deletePromptHistory = async (req, res) => {
  try {
    const { id } = req.params; // assuming the ID is passed as a URL parameter
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

    // Find the index of the promptHistory item by its _id
    const promptHistoryIndex = getDesignData.promptHistory.findIndex(
      (item) => item._id.toString() === id
    );

    if (promptHistoryIndex === -1) {
      return res.status(404).send({ error: "Prompt history item not found" });
    }

    // Remove the item from the promptHistory array
    getDesignData.promptHistory.splice(promptHistoryIndex, 1);

    // Save the updated document
    await getDesignData.save();

    // Return the updated document
    return res.status(200).send({message: "History deleted"});
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};



module.exports = {
  userData,
  getPromptHistoryById,
  recreatePromptHistory,
  deletePromptHistory
};