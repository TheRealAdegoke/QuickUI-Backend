const passport = require("passport");

const passportAuthForGoogle = passport.authenticate("google", [
  "profile",
  "email",
]);

const passportAuthForRegister = passport.authenticate("google", {
  successRedirect: "/auth/googlesignup",
  callbackURL: "https://quickui-backend.onrender.com/auth/google/signup",
});

const passportAuthForLogin = passport.authenticate("google", {
  successRedirect: "/auth/googlelogin",
  callbackURL: "https://quickui-backend.onrender.com/auth/google/login",
});

module.exports = {passportAuthForGoogle, passportAuthForRegister, passportAuthForLogin}