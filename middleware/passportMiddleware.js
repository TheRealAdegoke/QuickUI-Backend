const User = require("../Models/User");
const bcrypt = require("bcrypt");
const tokens = require("../Utils/token");

const registerWithGoogle = async (req, res, next) => {
  try {
    const profile = req.user;
    let user = await User.findOne({ email: profile.email });

    if (user) {
      return res.redirect(
        `${process.env.CORS_VERCEL_FRONTEND}/register?error=userExists`
      );
    }

    const hashedPassword = await bcrypt.hash(
      process.env.Google_Users_Password,
      10
    );

    newUser = new User({
      fullName: profile.displayName,
      email: profile.emails[0].value,
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
      .redirect(`${process.env.CORS_VERCEL_FRONTEND}/home`);
  } catch (error) {
    next(error);
  }
};

const loginWithGoogle = async (req, res, next) => {
  try {
    const profile = req.user;
    let user = await User.findOne({ email: profile.email });

    if (!user) {
      return res.redirect(
        `${process.env.CORS_VERCEL_FRONTEND}/login?error=invalidUser`
      );
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
      .redirect(`${process.env.CORS_VERCEL_FRONTEND}/home`);
  } catch (error) {
    next(error);
  }
};

module.exports = { registerWithGoogle, loginWithGoogle };
