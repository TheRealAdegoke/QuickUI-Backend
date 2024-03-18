const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const connectDB = require("./Database/connectDB");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./Routes/passportConfig");

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
app.use("/", authRoutes);

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
