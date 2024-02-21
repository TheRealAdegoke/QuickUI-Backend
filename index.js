const express = require("express");
const app = express();
const connectDB = require("./Database/connectDB"); // Import the connectDB function from the external file
require("dotenv").config();

const authRoutes = require("./Routes/authRoutes")

app.get("/", (req, res) => {
  res.send("<h1>Lock and Load Cadet, shit is about to get ugly.</h1>");
});

app.use("/", express.json(), authRoutes)

const port = 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI); // Use the imported connectDB function
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
