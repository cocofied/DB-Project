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

app.use(express.static(path.join(__dirname, 'public')));

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
    const query = "SELECT CompanyID, CompanyName FROM CateringCompany";
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
app.post("/add_companies", (req, res) => {
    const { companyName, contactName, contactEmail, contactPhone, address, price } = req.body;

    // Validate input
    if (!companyName || !contactName || !contactEmail || !contactPhone || !address || !price) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = `
        INSERT INTO CateringCompany (CompanyName, ContactName, ContactEmail, ContactPhone, Address, Price)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [companyName, contactName, contactEmail, contactPhone, address, price], (err, results) => {
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
app.delete("/delete_companies", (req, res) => {
    const { CompanyName, Address } = req.body;

    // Validate input
    if (!CompanyName || !Address) {
        return res.status(400).json({ error: "Company name and address are required." });
    }

    const query = `
        DELETE FROM CateringCompany WHERE CompanyName = ? AND Address = ?
    `;
    db.query(query, [CompanyName, Address], (err, results) => {
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
app.get("/api/services/:CompanyId", (req, res) => {
    const { CompanyId } = req.params;
    const query = "SELECT Price FROM CateringCompany WHERE CompanyID = ?";
    db.query(query, [CompanyId], (err, results) => {
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

app.post("/addBooking", (req, res) => {
    const { ServiceName, Description, Price, PaymentMethod, UserID } = req.body;

    // Validate input
    if (!ServiceName || !Description || !Price || !PaymentMethod || !UserID) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Step 1: Query the User table to get the CustomerID based on UserID
    const userQuery = `
        SELECT CustomerID FROM Customer WHERE UserID = ?;
    `;
    
    db.query(userQuery, [UserID], (err, userResults) => {
        if (err) {
            console.error('Error querying User table:', err.message);
            return res.status(500).json({ error: "Database error while querying User." });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ error: "No matching User found." });
        }

        const CustomerID = userResults[0].CustomerID; // Extract the CustomerID from the result

        // Step 2: Query the CateringCompany table to get the CompanyID based on CompanyName (which is ServiceName)
        const companyQuery = `
            SELECT CompanyID FROM CateringCompany WHERE CompanyName = ?;
        `;
        
        db.query(companyQuery, [ServiceName], (err, companyResults) => {
            if (err) {
                console.error('Error querying CateringCompany:', err.message);
                return res.status(500).json({ error: "Database error while querying CateringCompany." });
            }

            if (companyResults.length === 0) {
                return res.status(404).json({ error: "No matching Catering company found." });
            }

            const CompanyID = companyResults[0].CompanyID; // Extract the CompanyID from the result

            // Step 3: Insert the service into the CateringService table with the retrieved CompanyID and UserID
            const serviceQuery = `
                INSERT INTO CateringService (ServiceName, Description, Price, CompanyID, CustomerID)
                VALUES (?, ?, ?, ?, ?)
            `;
            
            db.query(serviceQuery, [ServiceName, Description, Price, CompanyID, CustomerID], (err, serviceResults) => {
                if (err) {
                    console.error('Error inserting service:', err.message);
                    return res.status(500).json({ error: "Database error while inserting service." });
                }

                const ServiceID = serviceResults.insertId; // Get the ServiceID of the newly created service

                // Step 4: Insert the payment into the Payment table using the ServiceID and other details
                const paymentQuery = `
                    INSERT INTO Payment (PaymentDate, Amount, PaymentMethod, CustomerID, ServiceID)
                    VALUES (NOW(), ?, ?, ?, ?)
                `;
                
                db.query(paymentQuery, [Price, PaymentMethod, CustomerID, ServiceID], (err, paymentResults) => {
                    if (err) {
                        console.error('Error inserting payment:', err.message);
                        return res.status(500).json({ error: "Database error while inserting payment." });
                    }

                    // Successfully inserted both service and payment
                    res.status(201).json({ message: "Service and payment created successfully!" });
                });
            });
        });
    });
});

app.get("/getUserServices", (req, res) => {
    const { UserID } = req.query; // Assume UserID is sent as a query parameter

    if (!UserID) {
        return res.status(400).json({ error: "UserID is required." });
    }

    // Step 1: Query the Customer table to get the CustomerID based on UserID
    const userQuery = `
        SELECT CustomerID FROM Customer WHERE UserID = ?;
    `;

    db.query(userQuery, [UserID], (err, userResults) => {
        if (err) {
            console.error('Error querying User table:', err.message);
            return res.status(500).json({ error: "Database error while querying User." });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ error: "No matching User found." });
        }

        const CustomerID = userResults[0].CustomerID; // Extract the CustomerID

        // Step 2: Query the CateringService table to get the services booked by this Customer
        const serviceQuery = `
            SELECT s.ServiceID, s.ServiceName, s.Description, s.Price, s.CompanyID
            FROM CateringService s
            WHERE s.CustomerID = ?;
        `;

        db.query(serviceQuery, [CustomerID], (err, serviceResults) => {
            if (err) {
                console.error('Error querying CateringService table:', err.message);
                return res.status(500).json({ error: "Database error while querying CateringService." });
            }

            if (serviceResults.length === 0) {
                return res.status(404).json({ error: "No booked services found for this user." });
            }

            // Return the booked services as the response
            res.status(200).json(serviceResults);
        });
    });
});

// 2. Allow a user to leave a review for a selected service
app.post("/addReview", (req, res) => {
    const { Rating, Comments, UserID, ServiceID } = req.body;

    // Validate input
    if (!Rating || !Comments || !UserID || !ServiceID) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Step 1: Query the Customer table to get the CustomerID based on UserID
    const userQuery = `
        SELECT CustomerID FROM Customer WHERE UserID = ?;
    `;

    db.query(userQuery, [UserID], (err, userResults) => {
        if (err) {
            console.error('Error querying User table:', err.message);
            return res.status(500).json({ error: "Database error while querying User." });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ error: "No matching User found." });
        }

        const CustomerID = userResults[0].CustomerID; // Extract the CustomerID

        // Step 2: Insert the review into the ServiceReview table
        const reviewQuery = `
            INSERT INTO ServiceReview (ReviewDate, Rating, Comments, CustomerID, ServiceID)
            VALUES (NOW(), ?, ?, ?, ?);
        `;

        db.query(reviewQuery, [Rating, Comments, CustomerID, ServiceID], (err, reviewResults) => {
            if (err) {
                console.error('Error inserting review:', err.message);
                return res.status(500).json({ error: "Database error while inserting review." });
            }

            // Successfully added the review
            res.status(201).json({ message: "Review submitted successfully!" });
        });
    });
});

app.get('/getServiceDetails', (req, res) => {
    const { ServiceID } = req.query;
    
    if (!ServiceID) {
        return res.status(400).json({ error: "ServiceID is required" });
    }

    const query = `
        SELECT ServiceName, Description, Price
        FROM CateringService
        WHERE ServiceID = ?
    `;
    
    db.query(query, [ServiceID], (err, results) => {
        if (err) {
            console.error("Error fetching service details:", err.message);
            return res.status(500).json({ error: "Database error while fetching service details." });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Service not found." });
        }

        res.json(results[0]);
    });
});


// Start the Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
