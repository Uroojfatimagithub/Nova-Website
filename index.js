require('dotenv').config(); // Load environment variables from .env
const express = require("express");
const path = require("path");
const sql = require("mssql");
const poolPromise = require("./db"); // Database connection
//require("dotenv").config();

const app = express();

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "frontend")));

// Registration API
app.post("/register", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required!" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match!" });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("username", sql.NVarChar, username)
            .input("email", sql.NVarChar, email)
            .input("password", sql.NVarChar, password)
            .query("INSERT INTO users (username, email, password) VALUES (@username, @email, @password)");

        res.status(200).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to register user" });
    }
});

// Catch-all route to serve frontend
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend","index.html"));
});

// Start server
const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
