// Check if not in production environment, then load environment variables from .env file
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
    console.log('Running in development.')
} else {
    console.log('Running in production environment.')
}

const express = require("express"); 
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const connectDB = require("./Database/connectDB");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./Strategies/passportConfig");

const authRoutes = require("./Routes/authRoutes");
const thirdPartiesRoutes = require("./Routes/thirdPartiesRoutes")
const lemonSqueezyRoute = require("./Routes/LemonSqueezyRoute");


app.use("/api/webhook", bodyParser.text({ type: "*/*" }));
app.use(cookieParser());

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CORS_GOOGLE,
      process.env.CORS_VITE_LOCAL_HOST,
      process.env.CORS_NODE_LOCAL_HOST,
      process.env.CORS_RENDER,
      process.env.CORS_VITE_LOCAL_HOST_SUB_DOMAIN,
      process.env.CORS_VERCEL_FRONTEND,
      process.env.CORS_QUICKUI_CO,
      process.env.CORS_WWW_QUICKUI_CO,
      process.env.CORS_AZURE,
      process.env.CORS_NODE_LOCAL_HOST_PORT_AUTH,
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

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

app.use("/api/auth", express.json(), authRoutes);
app.use("/api", express.json(), thirdPartiesRoutes);
app.use("/api", lemonSqueezyRoute);

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