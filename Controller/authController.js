const User = require("../Models/User");
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

    sendWelcomeEmail(email, fullName);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const { accessToken, refreshToken } = await tokens({ user: newUser._id });

    res
      .status(201)
      .cookie("accessToken", accessToken, {
        maxAge: 600000,
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
      })
      .cookie("refreshToken", refreshToken, {
        maxAge: 432000000,
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
      })
      .send({
        message: "User registered successfully",
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

    const { accessToken, refreshToken } = await tokens(user._id);

    res
      .status(201)
      .cookie("accessToken", accessToken, {
        maxAge: 600000,
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
      })
      .cookie("refreshToken", refreshToken, {
        maxAge: 432000000,
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
      })
      .send({
        message: "Logged In",
      });
  } catch (error) {
    console.error("Error Signing In User", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const authToken = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.send({ authenticated: false });
    }

    jwt.verify(accessToken, process.env.JWT_SECRET);
    res.send({ authenticated: true });
  } catch (error) {
    return res.send({ authenticated: false, error: error });
  }
};

//periodically check if the user is logged in then generate a new access token.
const authRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send("Please Login");
    }

    // Verify the token
    const verified = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Calculate the expiration time of the token
    const expirationTime = new Date(verified.exp * 1000);

    // Check if the token has expired
    if (expirationTime <= new Date()) {
      return res.status(400).send("Your token has expired");
    }

    // Generate a new access token
    const { accessToken } = await tokens(verified.user);

    // Set the new access token in the response cookie
    res
      .status(200)
      .cookie("accessToken", accessToken, {
        maxAge: 600000,
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
      })
      .send();
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

//log a user out
const unauthenticateUser = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("accessToken", "", {
        expires: new Date(0),
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
      })
      .cookie("refreshToken", "", {
        expires: new Date(0),
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
      })
      .send({ message: "Logged out" });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
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
    const { forgotpasswordToken } = await tokens(user._id);

    sendResetPasswordLink(email, user.fullName);

    res
      .status(200)
      .cookie("resetToken", forgotpasswordToken, {
        maxAge: 3600000, // 1 hour expiration time
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
      })
      .send({ message: "Reset password link sent to your email" });
  } catch (error) {
    console.error("Error sending reset password link:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { password } = req.body;
    const resetToken = req.cookies.resetToken;

    // Check if reset token exists
    if (!resetToken) {
      return res.status(400).send({ error: "Reset token not found" });
    }

    // Verify the reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    // Update user's password
    const user = await User.findById(decoded.user);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    // Update user's password with the new one
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    // Clear reset token cookie
    res.clearCookie("resetToken", { path: "/" });

    // Send response
    res.status(200).send({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const userData = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).send({ error: "Please Login" });
    }

    const verified = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = verified.user;
    const getUserData = await User.findById(user);

    if (!user) {
      return res.status(400).send({ error: "Invalid User" });
    }

    return res.status(200).json({
      fullname: getUserData.fullName,
      email: getUserData.email,
      history: getUserData.promptHistory
    });
  } catch (error) {
    console.error("error: ", error);
    res.status(500).send({ "Internal Server Error: ": error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  authToken,
  authRefreshToken,
  unauthenticateUser,
  forgotpassword,
  resetpassword,
  userData,
};
