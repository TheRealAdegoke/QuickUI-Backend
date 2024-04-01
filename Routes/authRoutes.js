const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  authToken,
  authRefreshToken,
  unauthenticateUser,
  forgotpassword,
  resetpassword,
} = require("../Controller/authController");
const {
  passportAuthForGoogle,
  passportAuthForRegister,
  passportAuthForLogin,
} = require("../PassportController/passportAuthenticate");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/googlesignup");

router.get("/googlelogin");

router.get("/google", passportAuthForGoogle);

router.get("/google/signup", passportAuthForRegister);

router.get("/google/login", passportAuthForLogin);

router.get("/loggedIn", authToken)

router.post("/refresh", authRefreshToken);

router.post("/logout", unauthenticateUser);

router.post("/forgotpassword", forgotpassword);

router.post("/resetpassword", resetpassword);

module.exports = router;