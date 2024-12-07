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

app.post("/sign-in", async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
      return res.status(400).json({ message: "Email and password are required." });
  }

  try {
      // Query to fetch user by email
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

          // Compare passwords
          const isMatch = await bcrypt.compare(Password, user.PasswordHash);
          if (!isMatch) {
              return res.status(401).json({ message: "Invalid credentials." });
          }

          // Return user details (excluding sensitive information)
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
  
  // sign-up
  app.post("/sign-up", async (req, res) => {
    const { FirstName, LastName, Email, Password, PhoneNuber, Address } = req.body;

    // Validate input
    if (!FirstName || !LastName || !Email || !Password || !PhoneNumber || !Address) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if the email already exists
        const checkQuery = "SELECT * FROM User WHERE Email = ?";
        db.query(checkQuery, [Email], async (error, results) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ message: "Server error." });
            }

            if (results.length > 0) {
                return res.status(409).json({ message: "Email is already registered." });
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Password, salt);

            // Insert into User table
            const userInsertQuery = `
                INSERT INTO User (Username, PasswordHash, Email, CreatedAt)
                VALUES (?, ?, ?, NOW())
            `;
            db.query(userInsertQuery, [`${firstName} ${lastName}`, hashedPassword, email], (error, userResult) => {
                if (error) {
                    console.error(error.message);
                    return res.status(500).json({ message: "Server error." });
                }

                const userId = userResult.insertId;

                // Insert into Customer table
                const customerInsertQuery = `
                    INSERT INTO Customer (FirstName, LastName, Email, PhoneNumber, Address, UserID)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                db.query(customerInsertQuery, [firstName, lastName, email, phone, address, userId], (error) => {
                    if (error) {
                        console.error(error.message);
                        return res.status(500).json({ message: "Server error." });
                    }

                    // Success response
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
  
    // Simulate fetching price from database (or other logic)
    const minPrice = 10;
    const maxPrice = 100;
    const randomPrice = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
  
    res.json({ price: randomPrice });
  });
  

  const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});