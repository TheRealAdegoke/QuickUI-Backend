const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const tokens = require("../Utils/token");
const {
  sendResetPasswordLink,
  sendWelcomeEmail,
} = require("../Services/authMailer");

// ! Email validation regex pattern
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

    const { accessToken, refreshToken } = await tokens(newUser._id);

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
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.send(false);
    }

    jwt.verify(accessToken, process.env.JWT_SECRET);
    res.send(true);
  } catch (error) {
    return res.send(false);
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
        expiresIn: new Date(0),
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
      })
      .cookie("refreshToken", "", {
        expiresIn: new Date(0),
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

// Map to store reset password tokens and their expiration times
const resetPasswordTokens = new Map();

const forgotpassword = async (req, res) => {
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

    sendResetPasswordLink(email, user.fullName, token);

    res
      .status(200)
      .send({ message: "Reset password link sent ", token: token });
  } catch (error) {
    console.error("Error sending reset link", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // ! Check if the token and new password are provided
    if (!token) {
      return res.status(400).send({ error: "Token is required" });
    }

    if (!password) {
      return res.status(400).send({ error: "Password is required" });
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
};

module.exports = {registerUser, loginUser, authToken, authRefreshToken, unauthenticateUser, forgotpassword, resetpassword}