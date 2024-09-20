const express = require("express");
const session = require("express-session");
const passport = require("./config/passport"); // Updated path to passport.js
const authRoute = require("./routes/authRoute"); // Updated path to authRoute.js
const connection = require("./config/db.js");
const clientRoute = require("./routes/clientRoute")
const invoiceRoute = require("./routes/invoiceRoute")
const cors = require("cors")

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to initialize Passport and session
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend origin
    credentials: true // Allow credentials (if needed)
}));
app.use(express.json())
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Use the authentication routes
(async () => {
    try {
        await connection(); // Await the connection before starting the server
        console.log("Database connected successfully");
        app.use("/", authRoute);
        app.use("/client", clientRoute);
        app.use("/invoice", invoiceRoute);

        // Start server
        app.listen(PORT, () => {
            console.log("Server running on", PORT);
        });


    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1); // Exit the process if the connection fails
    }
})();

