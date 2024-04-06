// Check if not in production environment, then load environment variables from .env file
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
    console.log('Running in development.')
} else {
    console.log('Running in production environment.')
}

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const connectDB = require("./Database/connectDB");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./PassportController/passportConfig");

const authRoutes = require("./Routes/authRoutes");

app.use(express.json());
app.use(cookieParser());

// Setup express middleware
app.use(
  cors({
    origin: [
      "https://www.google.com",
      "http://localhost:5173",
      "http://localhost:3000",
      "https://quickui-backend.onrender.com",
      "http://192.168.43.251:5173",
      "https://quickai-lovat.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);


// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Your routes
app.get("/", (req, res) => {
  res.send("<h1>Lock and Load Cadet, shit is about to get ugly.</h1>");
});

// Your other routes
app.use("/api/auth", authRoutes);

const port = 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
