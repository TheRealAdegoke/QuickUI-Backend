const User = require("../Models/User");
const Design = require("../Models/Design");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const tokens = require("../Utils/token");
const {
  sendResetPasswordLink,
  sendWelcomeEmail,
} = require("../Services/authMailer");

// ! Email validation regesignx pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerUser = async (req, res) => {
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

    await sendWelcomeEmail(email, fullName);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      productId: "",
      variantId: "",
      status: "free",
      LemonSqueezyCreatedAt: "",
      productName: "",
      variantName: "",
      trials: 3,
    });

    const savedUser = await newUser.save();

    const newDesign = new Design({
      userId: savedUser._id,
    });

    await newDesign.save();

    const { accessToken, refreshToken } = tokens(newUser._id);

    res.status(201).send({
      message: "User registered successfully",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error("Error Registering user", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
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

    const { accessToken, refreshToken } = tokens(user._id);

    res.status(200).send({
      message: "Logged In",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error("Error Signing In User", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const authToken = async (req, res) => {
  try {
    // Get the access token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.send({ authenticated: false });
    }

    const accessToken = authHeader.split(" ")[1]; // Extract the token

    // Verify the token
    jwt.verify(accessToken, process.env.JWT_SECRET);
    res.send({ authenticated: true });
  } catch (error) {
    return res.send({ authenticated: false, error: error });
  }
};

// periodically check if the user is logged in then generate a new access token.
const authRefreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).send("Please Login");
    }

    const refreshToken = authHeader.split(" ")[1];

    // Verify the refresh token
    const verified = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Calculate the expiration time of the token
    const expirationTime = new Date(verified.exp * 1000);

    // Check if the token has expired
    if (expirationTime <= new Date()) {
      return res.status(400).send("Your token has expired");
    }

    // Generate a new access token
    const { accessToken } = tokens(verified.user);

    res.status(201).send({
      accessToken: accessToken,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    // Generate a reset password token
    const { forgotpasswordToken } = tokens(user._id);

    await sendResetPasswordLink(email, user.fullName);

    res.status(200).send({
      message: "Reset password link sent to your email",
      forgotpasswordToken: forgotpasswordToken,
    });
  } catch (error) {
    console.error("Error sending reset password link:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const resetpassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).send({ error: "Reset token not found" });
    }

    const resetToken = authHeader.split(" ")[1]; // Extract the token

    // Verify the reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    // Update user's password
    const user = await User.findById(decoded.user);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    // Update user's password with the new one
    user.password = await bcrypt.hash(req.body.password, 10);
    await user.save();

    // Send response
    res.status(200).send({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};


module.exports = {
  registerUser,
  loginUser,
  authToken,
  authRefreshToken,
  forgotpassword,
  resetpassword,
};
