const express = require("express");
const passport = require("../config/passport"); // Ensure correct path
const ensureAuthenticated = require("../middlewares/authMiddleware"); // Ensure correct path
const User = require("../models/userModel"); // Ensure correct path
const router = express.Router();
const bcrypt = require('bcryptjs');
const zod = require("zod");
const jwt = require("jsonwebtoken");

// Home route: redirect to Google OAuth
router.get("/", (req, res) => {
    res.redirect("/auth/google");
});

// Google OAuth route
router.get("/auth/google", passport.authenticate('google', { scope: ['email', 'profile'] }));

// Google OAuth callback route
router.get("/auth/google/callback",
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        const user = req.user;
        req.session.token = user.token // If token doesn't exist, create one
        console.log("token set", req.session.token)
        req.session.userInfo = {
            id: user._id,
            name: user.name,
            email: user.email
        };
        if (user) {
            res.redirect(`http://localhost:5173/option`);
        } else {
            res.redirect('/');
        }
    }
);

// Protected route example
router.get("/protected", ensureAuthenticated, (req, res) => {
    res.send("Hello, you're authenticated!");
});

// Sign-up route
const signupSchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(8)
});

router.post('/signup', async (req, res) => {
    const { success } = signupSchema.safeParse(req.body);
    if (!success) return res.status(403).json({ message: "Invalid email or password" });

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists with that email.' });
        }

        user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        req.session.token = token;
        console.log("token set", req.session.token)

        res.status(200).json({ success: true, message: 'User created successfully.', token });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Login route
const loginSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8)
});

router.post('/login', async (req, res, next) => {
    const { success } = loginSchema.safeParse(req.body);
    if (!success) return res.status(403).json({ message: "Invalid email or password" });

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Check password
        if (!user.googleId) {
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid password.' });
            }
        }

        req.login(user, (err) => {
            if (err) return next(err);

            const token = jwt.sign({ email }, process.env.JWT_SECRET);
            req.session.token = token;

            res.status(200).json({ success: true, message: 'Logged in successfully.', token });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Get token route
router.get("/getToken", (req, res) => {
    console.log("Session token:", req.session.token);
    if (req.session.token == undefined) {
        return res.json({ success: false })
    }
    return res.status(200).json({
        success: true, token: req.session.token
    });
});
router.post("/clearToken", (req, res) => {
    console.log("Clearing session token...");

    req.session.destroy(err => {
        if (err) {
            console.error("Error clearing session:", err);
            return res.status(500).json({ success: false, message: "Failed to log out." });
        }

        console.log("Session cleared successfully.");
        return res.status(200).json({ success: true, message: "Logged out successfully." });
    });
});


module.exports = router;
