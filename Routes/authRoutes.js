const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");

// ! Email validation regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/auth/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingEmail = await User.findOne({ email });

    if (fullName === "" || email === "" || password === "") {
      return res.status(400).send({ error: "Please fill all inputs" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).send({ error: "Invalid email address" });
    }

    if (existingEmail) {
      return res.status(400).send({ error: "Email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .send({ error: "Password should be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    res
      .status(200)
      .send({ message: "User registered successfully", token: token });
  } catch (error) {
    console.error("Error Registering user", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (email === "" || password === "") {
      return res.status(400).send({ error: "Please fill all inputs" });
    }

    if (!email || !password) {
      return res
        .status(400)
        .send({ error: "Please provide email and password" });
    }

    if (!user) {
      return res.status(400).send({ error: "Invalid Email Address" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ error: "Invalid Password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    res.status(200).send({ message: "Logged In", token: token });
  } catch (error) {
    console.error("Error Signing In User", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Google OAuth login route
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/register?error=userExists",
    failureFlash: true,
  }),
  async (req, res) => {
    try {
      // User is successfully authenticated via Google OAuth
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "5d",
      });

      console.log(token);

      res.cookie("token", token);

      // Redirect to the desired URL without including the token in the URL
      res.redirect("http://localhost:5173/dashboard");
    } catch (error) {
      console.error("Error processing Google OAuth callback", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
);



module.exports = router;
