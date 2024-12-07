const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Add Company
app.post("/companies", async (req, res) => {
    const { companyName, contactName, contactEmail, contactPhone, address } = req.body;

    // Validate input
    if (!companyName || !contactName || !contactEmail || !contactPhone || !address) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const query = `
            INSERT INTO CateringCompany (Name, ContactName, ContactEmail, ContactPhone, Address)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(query, [companyName, contactName, contactEmail, contactPhone, address], (error, result) => {
            if (error) {
                console.error("Error adding company:", error.message);
                return res.status(500).json({ error: "Failed to add company." });
            }

            res.status(201).json({ message: "Company added successfully!", companyId: result.insertId });
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Server error." });
    }
});

// Delete Company
app.delete("/companies", async (req, res) => {
    const { companyName, address } = req.body;

    // Validate input
    if (!companyName || !address) {
        return res.status(400).json({ error: "Company name and address are required." });
    }

    try {
        const query = `
            DELETE FROM CateringCompany WHERE Name = ? AND Address = ?
        `;
        db.query(query, [companyName, address], (error, result) => {
            if (error) {
                console.error("Error deleting company:", error.message);
                return res.status(500).json({ error: "Failed to delete company." });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Company not found." });
            }

            res.json({ message: "Company deleted successfully!" });
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Server error." });
    }
});

// Existing routes
app.post("/sign-in", async (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const query = "SELECT * FROM User WHERE Email = ?";
        db.query(query, [Email], async (error, results) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ message: "Server error." });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(Password, user.PasswordHash);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials." });
            }

            res.status(200).json({
                user: {
                    userId: user.UserID,
                    username: user.Username,
                    email: user.Email,
                    createdAt: user.CreatedAt,
                },
            });
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
});

app.post("/sign-up", async (req, res) => {
    const { FirstName, LastName, Email, Password, PhoneNumber, Address } = req.body;

    if (!FirstName || !LastName || !Email || !Password || !PhoneNumber || !Address) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const checkQuery = "SELECT * FROM User WHERE Email = ?";
        db.query(checkQuery, [Email], async (error, results) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ message: "Server error." });
            }

            if (results.length > 0) {
                return res.status(409).json({ message: "Email is already registered." });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Password, salt);

            const userInsertQuery = `
                INSERT INTO User (Username, PasswordHash, Email, CreatedAt)
                VALUES (?, ?, ?, NOW())
            `;
            db.query(userInsertQuery, [`${FirstName} ${LastName}`, hashedPassword, Email], (error, userResult) => {
                if (error) {
                    console.error(error.message);
                    return res.status(500).json({ message: "Server error." });
                }

                const userId = userResult.insertId;

                const customerInsertQuery = `
                    INSERT INTO Customer (FirstName, LastName, Email, PhoneNumber, Address, UserID)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                db.query(customerInsertQuery, [FirstName, LastName, Email, PhoneNumber, Address, userId], (error) => {
                    if (error) {
                        console.error(error.message);
                        return res.status(500).json({ message: "Server error." });
                    }

                    res.status(201).json({ message: "Account created successfully!" });
                });
            });
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
});

app.get('/api/services/:serviceId', async (req, res) => {
    const { serviceId } = req.params;

    const minPrice = 10;
    const maxPrice = 100;
    const randomPrice = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;

    res.json({ price: randomPrice });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});