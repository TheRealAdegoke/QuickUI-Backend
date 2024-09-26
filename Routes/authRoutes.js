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
const {
  registerWithGoogle,
  loginWithGoogle,
} = require("../middleware/passportMiddleware");
const {
  userData,
  updateFullName,
  updatePassword,
  getPromptHistoryById,
  recreatePromptHistory,
  deletePromptHistory,
} = require("../Controller/userDataController");
const rateLimit = require("express-rate-limit");

// Apply rate limiter to the /api/auth route
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: "Too many attempts, please try again after 5 minutes",
});

router.post("/register", authLimiter, registerUser);

router.post("/login", authLimiter, loginUser);

router.get("/googlesignup", registerWithGoogle);

router.get("/googlelogin", loginWithGoogle);

router.get("/google", passportAuthForGoogle);

router.get("/google/signup", passportAuthForRegister);

router.get("/google/login", passportAuthForLogin);

router.get("/loggedIn", authToken);

router.post("/refresh", authRefreshToken);

router.post("/logout", authLimiter, unauthenticateUser);

router.post("/forgotpassword", authLimiter, forgotpassword);

router.post("/resetpassword", authLimiter, resetpassword);

router.get("/user-data", userData);

router.put("/updateFullName", authLimiter, updateFullName);

router.put("/updatePassword", authLimiter, updatePassword);

router.get("/user-data/:id", getPromptHistoryById);

router.post("/recreate-prompt-history/:id", recreatePromptHistory);

router.delete("/delete-prompt-history/:id", deletePromptHistory);

module.exports = router;
