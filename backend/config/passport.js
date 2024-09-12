const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require('dotenv').config(); // Ensure dotenv is loaded

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '383756959325-qtc4fc4ckngs9nf5gicejtkce2lbhs2t.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
    callbackURL: "http://localhost:3000/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
    console.log(accessToken, refreshToken, profile);
    return done(null, profile);
}));

// Serialize and Deserialize the user for session handling
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;
