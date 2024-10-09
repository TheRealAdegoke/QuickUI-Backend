const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  registerUser,
  loginUser,
  authToken,
  authRefreshToken,
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
  uploadImage
} = require("../Controller/userDataController");
const rateLimit = require("express-rate-limit");

// Multer configuration for file size and type validation
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory temporarily
  limits: { fileSize: 3 * 1024 * 1024 }, // Limit file size to 3MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(file.originalname.toLowerCase());

    if (mimeType && extname) {
      return cb(null, true);
    }
    return cb(new Error("Only .jpeg, .jpg, .png, and .webp formats are allowed"));
  },
});

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

router.post("/forgotpassword", authLimiter, forgotpassword);

router.post("/resetpassword", authLimiter, resetpassword);

router.get("/user-data", userData);

router.put("/updateFullName", authLimiter, updateFullName);

router.put("/updatePassword", authLimiter, updatePassword);

router.get("/user-data/:id", getPromptHistoryById);

router.post("/recreate-prompt-history/:id", recreatePromptHistory);

router.delete("/delete-prompt-history/:id", deletePromptHistory);

router.post(
  "/upload",
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        // Handle Multer errors
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .send({ error: "File size should not exceed 3MB" });
        }

        if (err.message) {
          return res.status(400).send({ error: err.message });
        }

        // Handle other errors
        return res
          .status(500)
          .send({ error: "An unexpected error occurred during upload" });
      }

      // If no error, continue to the controller function
      next();
    });
  },
  uploadImage
);

module.exports = router;
