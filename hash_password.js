// hash_password.js
const bcrypt = require('bcryptjs');

const plainPassword = 'your_admin_password'; // <--- REPLACE WITH YOUR DESIRED ADMIN PASSWORD
const saltRounds = 10; // Number of salt rounds, 10 is a good default

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
    if (err) {
        console.error("Error hashing password:", err);
        return;
    }
    console.log("Hashed Password for '" + plainPassword + "':");
    console.log(hash);
    console.log("\nCopy this hash and insert it into your PostgreSQL 'users' table.");
});