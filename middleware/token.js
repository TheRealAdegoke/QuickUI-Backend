const jwt = require("jsonwebtoken");

const tokens = (user) => {
  // Generate a new access token
  const accessToken = jwt.sign({ user: user }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  // Refresh a new access token
  const refreshToken = jwt.sign({ user: user }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });

  return { accessToken, refreshToken };
};

module.exports = tokens;
