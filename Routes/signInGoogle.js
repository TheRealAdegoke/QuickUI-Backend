const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy
const User = require("../Models/User");
const bcrypt = require("bcrypt")

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.Client_ID,
      clientSecret: process.env.Client_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        const hashedPassword = await bcrypt.hash(
          process.env.Google_Users_Password, 10
        );

        if (!user) {
          user = new User({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
            password: hashedPassword,
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
