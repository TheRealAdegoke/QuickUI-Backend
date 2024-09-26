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
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./Strategies/passportConfig");

const authRoutes = require("./Routes/authRoutes");
const thirdPartiesRoutes = require("./Routes/thirdPartiesRoutes")

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      process.env.CORS_GOOGLE,
      process.env.CORS_VITE_LOCAL_HOST,
      process.env.CORS_NODE_LOCAL_HOST,
      process.env.CORS_RENDER,
      process.env.CORS_VITE_LOCAL_HOST_SUB_DOMAIN,
      process.env.CORS_VERCEL_FRONTEND,
      process.env.CORS_QUICKUI_CO,
      process.env.CORS_WWW_QUICKUI_CO,
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

app.get("/", (req, res) => {
  res.send("<h1>Lock and Load Cadet, shit is about to get ugly.</h1>");
});

app.use("/api/auth", authRoutes);
app.use("/api", thirdPartiesRoutes);

const port = 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();