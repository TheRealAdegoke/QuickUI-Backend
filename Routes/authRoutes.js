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

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/googlesignup", registerWithGoogle);

router.get("/googlelogin", loginWithGoogle);

router.get("/google", passportAuthForGoogle);

router.get("/google/signup", passportAuthForRegister);

router.get("/google/login", passportAuthForLogin);

router.get("/loggedIn", authToken);

router.post("/refresh", authRefreshToken);

router.post("/logout", unauthenticateUser);

router.post("/forgotpassword", forgotpassword);

router.post("/resetpassword", resetpassword);

router.get("/user-data", userData);

router.put("/updateFullName", updateFullName);

router.put("/updatePassword", updatePassword);

router.get("/user-data/:id", getPromptHistoryById);

router.post("/recreate-prompt-history/:id", recreatePromptHistory);

router.delete("/delete-prompt-history/:id", deletePromptHistory);

module.exports = router;
