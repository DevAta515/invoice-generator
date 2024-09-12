const express = require("express");
const passport = require("../config/passport"); // Updated path to passport.js
const ensureAuthenticated = require("../middlewares/authMiddleware"); // Updated path to authMiddleware.js

const router = express.Router();

// Home route
router.get("/", (req, res) => {
    res.send('<a href="/auth/google">Click here to login with Google</a>');
});

// Google OAuth route
router.get("/auth/google",
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

// Google OAuth callback route
router.get("/auth/google/callback",
    passport.authenticate('google', { failureRedirect: '/', successRedirect: "/protected" })
);

// Protected route (only accessible after login)
router.get("/protected", ensureAuthenticated, (req, res) => {
    res.send("Hello, you're authenticated!");
});

module.exports = router;
