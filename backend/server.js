require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors")
const PORT = 4000;
const { connection } = require("./config/db");

app.use(express.json());
app.use(cors());

(async () => {
    try {
        await connection();
        console.log("Database connected successfully");

        app.get("/", (req, res) => {
            res.send("API working");
        });
        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
})();