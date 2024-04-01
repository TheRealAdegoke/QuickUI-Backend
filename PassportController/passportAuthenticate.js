const passport = require("passport");

const passportAuthForGoogle = passport.authenticate("google", [
  "profile",
  "email",
]);

const passportAuthForRegister = passport.authenticate("google", {
  successRedirect: "/api/auth/google/signup",
  callbackURL: "https://quickui-backend.onrender.com/api/auth/google/signup",
});

const passportAuthForLogin = passport.authenticate("google", {
  successRedirect: "/api/auth/google/login",
  callbackURL: "https://quickui-backend.onrender.com/api/auth/google/login",
});

module.exports = {passportAuthForGoogle, passportAuthForRegister, passportAuthForLogin}