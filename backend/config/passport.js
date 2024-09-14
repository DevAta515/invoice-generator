const passport = require("passport");
const User = require("../models/userModel")
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken")
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '383756959325-qtc4fc4ckngs9nf5gicejtkce2lbhs2t.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
    callbackURL: "http://localhost:3000/auth/google/callback"
}, async function (accessToken, refreshToken, profile, done) {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value
            });
            await user.save();
        }
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
        );
        return done(null, { user, token });
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;
