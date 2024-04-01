const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);

    mongoose.connection.on("connected", () => {
      console.log("Mongodb Atlas Database Connected...");
    });

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });
  } catch (error) {
    console.error(`MongoDB connection error: ${error}`);
  }
};

module.exports = connectDB;
