const jwt = require("jsonwebtoken");

const tokens = (user) => {
  const secret = process.env.JWT_SECRET;
  // Generate a new access token
  const accessToken = jwt.sign({ user: user }, secret, {
    expiresIn: "10m",
  });

  // Refresh a new access token
  const refreshToken = jwt.sign({ user: user }, secret, {
    expiresIn: "5d",
  });

  const forgotpasswordToken = jwt.sign({ user: user }, secret, {
    expiresIn: "1h",
  });

  return { accessToken, refreshToken, forgotpasswordToken };
};

module.exports = tokens;
