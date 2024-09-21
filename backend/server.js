require('dotenv').config(); // Load environment variables
const express = require("express");
const session = require("express-session");
const passport = require("./config/passport"); // Ensure correct path
const authRoute = require("./routes/authRoute"); // Ensure correct path
const clientRoute = require("./routes/clientRoute");
const invoiceRoute = require("./routes/invoiceRoute");
const connection = require("./config/db.js");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware
app.use(cors({
    origin: 'http://localhost:5173', // Frontend origin
    credentials: true // Allow credentials (needed for cookies)
}));

// Body parser middleware
app.use(express.json());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallbackSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // For development; change to true in production with HTTPS
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Database connection and start server
(async () => {
    try {
        await connection(); // Wait for DB connection
        console.log("Database connected successfully");

        // Define routes
        app.use("/", authRoute);    // Authentication routes
        app.use("/client", clientRoute); // Client-related routes
        app.use("/invoice", invoiceRoute); // Invoice-related routes

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1); // Exit the process if the connection fails
    }
})();
