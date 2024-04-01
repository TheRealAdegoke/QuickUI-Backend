const mongoose = require("mongoose");

const connectDB = async (url) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(url, {});

    // Event listeners for connection-related events
    mongoose.connection.on("connected", () => {
      console.log("Mongodb Atlas Database Connected...");
      resolve();
    });

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
      reject(err);
    });
  });
};

module.exports = connectDB;
