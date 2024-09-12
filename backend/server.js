const express = require("express");
const session = require("express-session");
const passport = require("./config/passport"); // Updated path to passport.js
const authRoute = require("./routes/authRoute"); // Updated path to authRoute.js

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to initialize Passport and session
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Use the authentication routes
app.use("/", authRoute);

// Start server
app.listen(PORT, () => {
    console.log("Server running on", PORT);
});
