const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const nodemailer = require("nodemailer");

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

    sendWelcomeEmail(email, fullName);

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

async function sendWelcomeEmail(email, fullName) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Welcome To QuickUI",
      html: `
    <div
      style="
        font-family: Arial, sans-serif;
        max-width: 900px;
        margin: 0 auto;
        background-color: rgb(240,243,244);
        padding: 20px;
      "
    >
      <div style="background-color: white; padding: 15px;">
        <img src="https://res.cloudinary.com/dpyp7innp/image/upload/v1709021630/quick-removebg-preview_z29kwe.png" style="display: block; width: 150px; margin: 0 auto;" alt="QuickUI Logo">
        <h2 style="color: rgb(68,68,68); margin-top: 10px;">Welcome to QuickUI!</h2>
        <p style="font-size: 16px; color: rgb(128,128,128);">Hello ${fullName},</p>
        <p style="font-size: 16px; color: rgb(68,68,68);">We're excited to have you on board!</p>
        <p style="font-size: 16px; color: rgb(68,68,68);">QuickUI is here to simplify the process of creating stunning web designs. Whether you're an experienced designer or just starting, we've got you covered.</p>
        <p style="font-size: 16px; color: rgb(68,68,68);">Feel free to explore the powerful features and unleash your creativity with QuickUI.</p>
        <p style="font-size: 16px; color: rgb(68,68,68);">Happy designing!</p>
      </div>
    </div>
  `,
    };
    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent");
      }
    });
  } catch (error) {
    console.error("Error Sending Welcome Email", error);
    throw new Error("Error sending welcome email");
  }
}

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
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

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

// ! Map to store reset password tokens and their expiration times
const resetPasswordTokens = new Map();

router.post("/auth/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    resetPasswordTokens.set(token, {
      userId: user._id,
      expirationTime: Date.now() + 1 * 60 * 60 * 1000, // 1 hour
    });

    sendResetPasswordLink(email, user.fullName, token)

    res.status(200).send({ message: "Reset password link sent ", token: token });
  } catch (error) {
    console.error("Error sending reset link", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

async function sendResetPasswordLink(email, fullName, token) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const resetPasswordLink = `http://localhost:5173/resetpassword?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Reset Password",
      html: `
    <div
      style="
        font-family: Arial, sans-serif;
        max-width: 900px;
        margin: 0 auto;
        background-color: rgb(240,243,244);
        padding: 20px;
      "
    >
      <div style="background-color: white; padding: 15px;">
        <img src="https://res.cloudinary.com/dpyp7innp/image/upload/v1709021630/quick-removebg-preview_z29kwe.png" style="display: block; width: 150px; margin: 0 auto;" alt="QuickUI Logo">
        <h2 style="color: rgb(68,68,68); margin-top: 10px;">Welcome to QuickUI!</h2>
        <p style="font-size: 16px; color: rgb(128,128,128);">Hello ${fullName},</p>
        <p style="font-size: 16px; color: rgb(128,128,128)">
        To reset your password, please click on the link below: <strong style="color: #007BFF;">${resetPasswordLink}</strong> This link will expire in 1 hour.
      </p>
      <p style="font-size: 16px; color: rgb(68,68,68); font-weight: 600;">
        Best regards,<br /><br />QuickUI Team
      </p>
      </div>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending link", error);
    throw new Error("Error sending link");
  }
}

// ! Route to handle reset password action
router.post("/auth/resetpassword", async (req, res) => {
  try {
    const { token, password } = req.body;

    // ! Check if the token and new password are provided
    if (!token || !password) {
      return res.status(400).send({ error: "Token and password are required" });
    }

    // ! Check if the token is valid and not expired
    const resetTokenData = resetPasswordTokens.get(token);
    if (!resetTokenData || Date.now() > resetTokenData.expirationTime) {
      resetPasswordTokens.delete(token);
      return res.status(400).send({ error: "Invalid or expired token" });
    }

    // ! Find the user by userId
    const user = await User.findById(resetTokenData.userId);

    // ! Check if the user exists
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // ! Check if the password is at least 6 characters long
    if (password.length < 6) {
      return res
        .status(400)
        .send({ error: "Password should be at least 6 characters long" });
    }

    // ! Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ! Update the user's password
    user.password = hashedPassword;
    await user.save();

    // ! Remove the reset password token from the map
    resetPasswordTokens.delete(token);

    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});


module.exports = router;
