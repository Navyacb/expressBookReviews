const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user) => {
    return user.username === username;
});
// Return true if any user with the same username is found, otherwise false
if (userswithsamename.length > 0) {
    return true;
} else {
    return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
    }
  
    // Authenticate user
    if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      // Store access token and username in session
      req.session.authorization = {
        accessToken, username
      };
  
      // Return token in the response
      return res.status(200).json({ message: "User successfully logged in", token: accessToken });
    } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  });
  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Get the ISBN from the route
    const review = req.query.review; // Get the review from the query parameters

    // Access the username from the verified JWT payload (req.user)
    const username = req.user.username; // Use req.user if set in the auth middleware

    // Check if the book exists
    if (books[isbn]) {
        let book = books[isbn]; // Get the book
        if (!book.reviews) {
            book.reviews = {}; // Initialize reviews if not present
        }
        // Add or modify the review by the user
        book.reviews[username] = review;
        return res.status(200).json({ message: "Review added/modified successfully" });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Get the ISBN from the route
    const username = req.user.username; // Get the username from the verified token (set in the auth middleware)

    // Check if the book exists
    if (books[isbn]) {
        let book = books[isbn]; // Get the book
        if (book.reviews && book.reviews[username]) {
            delete book.reviews[username]; // Remove the review by the user
            return res.status(200).json({ message: "Review deleted successfully" });
        } else {
            return res.status(404).json({ message: "Review not found" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
