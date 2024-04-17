const passport = require("passport");

const passportAuthForGoogle = passport.authenticate("google", [
  "profile",
  "email",
]);

const passportAuthForRegister = passport.authenticate("google", {
  successRedirect: "/api/auth/googlesignup",
  callbackURL: `${process.env.CORS_RENDER}/api/auth/google/signup`,
});

const passportAuthForLogin = passport.authenticate("google", {
  successRedirect: "/api/auth/googlelogin",
  callbackURL: `${process.env.CORS_RENDER}/api/auth/google/login`,
});

module.exports = {
  passportAuthForGoogle,
  passportAuthForRegister,
  passportAuthForLogin,
};
