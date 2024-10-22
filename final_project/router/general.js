const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to wrap responses in promises
const respondWithPromise = (promise, res) => {
    return promise
        .then(data => res.status(200).json(data))
        .catch(err => res.status(404).json({ message: err.message }));
};

// User registration
public_users.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    return respondWithPromise(Promise.resolve(books), res);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn; // Extract the ISBN from the request parameters
    const book = books[isbn]; // Access the book using the ISBN as the key

    if (book) {
        return respondWithPromise(Promise.resolve(book), res);
    } else {
        return respondWithPromise(Promise.reject(new Error("Book not found")), res);
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author; // Extract the author from the request parameters
    const booksByAuthor = [];

    for (const key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor.push(books[key]);
        }
    }

    if (booksByAuthor.length > 0) {
        return respondWithPromise(Promise.resolve(booksByAuthor), res);
    } else {
        return respondWithPromise(Promise.reject(new Error("No books found by this author")), res);
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title; // Extract the title from the request parameters
    const booksByTitle = [];

    for (const key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            booksByTitle.push(books[key]);
        }
    }

    if (booksByTitle.length > 0) {
        return respondWithPromise(Promise.resolve(booksByTitle), res);
    } else {
        return respondWithPromise(Promise.reject(new Error("No books found with this title")), res);
    }
});

// Get book review
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn; // Extract the ISBN from the request parameters
    const book = books[isbn]; // Access the book using the ISBN as the key

    if (book) {
        const reviews = book.reviews; // Get the reviews for the book
        return respondWithPromise(Promise.resolve(reviews), res);
    } else {
        return respondWithPromise(Promise.reject(new Error("Book not found")), res);
    }
});

module.exports.general = public_users;
