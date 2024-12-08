const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const path = require("path");
const cors = require("cors");


require("dotenv").config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Parse JSON requests
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(cors({
    origin: "http://127.0.0.1:8080", // Explicitly allow your frontend
}));

// Database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Test the database connection
db.query("SELECT 1", (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Database connected successfully!");
    }
});

// Server Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "homepage.html"));
});

// Sign Up Route
app.post("/sign-up", async (req, res) => {
    const { FirstName, LastName, Email, Password, PhoneNumber, Address } = req.body;

    // Validate input
    if (!FirstName || !LastName || !Email || !Password || !PhoneNumber || !Address) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Insert into User table
        const userQuery = `
            INSERT INTO User (FirstName, LastName, Email, PasswordHash, PhoneNumber, Address)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(
            userQuery,
            [FirstName, LastName, Email, hashedPassword, PhoneNumber, Address],
            (err, userResults) => {
                if (err) {
                    console.error("Error creating user:", err.message);

                    // Handle duplicate email error
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(400).json({ error: "Email is already in use." });
                    }

                    return res.status(500).json({ error: "Database error." });
                }

                // Insert into Customer table with UserID from the User table
                const customerQuery = `
                    INSERT INTO Customer (FirstName, LastName, Email, PhoneNumber, Address, UserID)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                db.query(
                    customerQuery,
                    [FirstName, LastName, Email, PhoneNumber, Address, userResults.insertId],
                    (err, customerResults) => {
                        if (err) {
                            console.error("Error creating customer:", err.message);
                            return res.status(500).json({ error: "Failed to create customer record." });
                        }

                        res.status(201).json({ message: "User and customer created successfully!" });
                    }
                );
            }
        );
    } catch (error) {
        console.error("Error during sign-up:", error.message);
        res.status(500).json({ error: "Server error." });
    }
});


// Sign In Route
app.post("/sign-in", async (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).json({ error: "Email and Password are required." });
    }

    const query = `SELECT * FROM User WHERE Email = ?`;
    db.query(query, [Email], async (err, results) => {
        if (err) {
            console.error("Error fetching user:", err.message);
            return res.status(500).json({ error: "Database error." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(Password, user.PasswordHash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        // Remove sensitive data before sending the user object
        delete user.PasswordHash;
        res.status(200).json({ message: "Sign-in successful!", user });
    });
});
// Fetch all Catering Companies (Add this route here)
app.get("/companies", (req, res) => {
    const query = "SELECT ServiceID, ServiceName FROM CateringService";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching companies:", err.message);
            return res.status(500).json({ error: "Database error." });
        }
        res.status(200).json(results);
    });
});



//recover password route
app.post("/recover-password", (req, res) => {
    const { Email } = req.body;

    if (!Email) {
        return res.status(400).json({ error: "Email is required." });
    }

    const query = `SELECT PasswordHash FROM User WHERE Email = ?`;
    db.query(query, [Email], (err, results) => {
        if (err) {
            console.error("Error fetching user:", err.message);
            return res.status(500).json({ error: "Database error." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Email not found." });
        }

        // Respond with the password (for demonstration purposes only; DO NOT use this in production)
        res.status(200).json({ password: results[0].PasswordHash });
    });
});


// Add Catering Company
app.post("/companies", (req, res) => {
    const { companyName, contactName, contactEmail, contactPhone, address } = req.body;

    // Validate input
    if (!companyName || !contactName || !contactEmail || !contactPhone || !address) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = `
        INSERT INTO CateringCompany (Name, ContactName, ContactEmail, ContactPhone, Address)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [companyName, contactName, contactEmail, contactPhone, address], (err, results) => {
        if (err) {
            console.error("Error adding company:", err.message);

            // Handle duplicate entry errors
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ error: "A company with this name and address already exists." });
            }

            return res.status(500).json({ error: "Database error." });
        }

        res.status(201).json({ message: "Company added successfully!" });
    });
});


// Delete Catering Company
app.delete("/companies", (req, res) => {
    const { companyName, address } = req.body;

    // Validate input
    if (!companyName || !address) {
        return res.status(400).json({ error: "Company name and address are required." });
    }

    const query = `
        DELETE FROM CateringCompany WHERE Name = ? AND Address = ?
    `;
    db.query(query, [companyName, address], (err, results) => {
        if (err) {
            console.error("Error deleting company:", err.message);
            return res.status(500).json({ error: "Database error." });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Company not found." });
        }

        res.json({ message: "Company deleted successfully!" });
    });
});

// Fetch Service Price
app.get("/api/services/:serviceId", (req, res) => {
    const { serviceId } = req.params;
    const query = "SELECT Price FROM CateringService WHERE ServiceID = ?";
    db.query(query, [serviceId], (err, results) => {
        if (err) {
            console.error("Error fetching price:", err.message);
            return res.status(500).json({ error: "Database error." });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Service not found." });
        }
        res.json({ price: results[0].Price });
    });
});


// Start the Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
