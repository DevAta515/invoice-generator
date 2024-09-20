require('dotenv').config();
const express = require("express");
const passport = require("../config/passport"); // Updated path to passport.js
const ensureAuthenticated = require("../middlewares/authMiddleware"); // Updated path to authMiddleware.js
const User = require("../models/userModel")
const router = express.Router();
const bcrypt = require('bcryptjs');
const zod = require("zod");
const jwt = require("jsonwebtoken");

// Home route
router.get("/", (req, res) => {
    // res.send('<a href="/auth/google">Click here to login with Google</a>');
    res.redirect("/auth/google");
});

// Google OAuth route
router.get("/auth/google",
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

// Google OAuth callback route
router.get("/auth/google/callback",
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        const user = req.user;
        req.session.token = user.token;
        req.session.userInfo = {
            id: user.user._id,
            name: user.user.name,
            email: user.user.email
        };
        if (user && user.token) {
            res.redirect(`http://localhost:5173`);
        } else {
            res.redirect('/');
        }
    }
);

router.get("/protected", ensureAuthenticated, (req, res) => {
    res.send("Hello, you're authenticated!");
});

const signupSchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(8)
})

router.post('/signup', async (req, res) => {
    const body = req.body;
    const { success } = signupSchema.safeParse(body);
    if (!success) return res.status(403).json({ message: "Invalid email or password" })
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists with that email.' });
        }
        user = new User({ name, email, password });
        await user.save();
        const userId = user.email;
        const token = jwt.sign({ userId }, process.env.JWT_SECRET);
        req.session.token = token;
        res.status(200).json({ success: true, message: 'User created successfully.', token });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

const loginSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8)
})
router.post('/login', async (req, res, next) => {
    const { success } = loginSchema.safeParse(req.body);
    if (!success) return res.status(403).json({ message: "Invalid email or password" });
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
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

router.get("/getToken", (req, res) => {
    return res.status(200).json({
        success: true, token: req.session.token
    })
})

module.exports = router;
