const bcrypt = require("bcryptjs");

// Replace these values with your test data
const enteredPassword = "hashed_password_1"; // Replace with the plain password you want to test
const storedHash = "hashed_password_1"; // Replace with the actual hash from your database

// Compare the entered password with the stored hash
bcrypt.compare(enteredPassword, storedHash, (err, isMatch) => {
    if (err) {
        console.error("Error comparing passwords:", err);
        return;
    }

    console.log("Password Match Result:", isMatch);
});
