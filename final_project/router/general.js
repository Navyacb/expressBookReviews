const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Extract the ISBN from the request parameters
  const book = books[isbn]; // Access the book using the ISBN as the key

  if (book) {
    return res.status(200).json(book); // Return the book details if found
  } else {
    return res.status(404).json({ message: "Book not found" }); // Return an error if not found
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author; // Extract the author from the request parameters
  const booksByAuthor = [];

  for (const key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push(books[key]);
    }
  }

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor); // Return the list of books by the author
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title; // Extract the title from the request parameters
  const booksByTitle = [];

  for (const key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle.push(books[key]);
    }
  }

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle); // Return the list of books with the given title
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn; // Extract the ISBN from the request parameters
    const book = books[isbn]; // Access the book using the ISBN as the key
  
    if (book) {
      const reviews = book.reviews; // Get the reviews for the book
      return res.status(200).json(reviews); // Return the reviews
    } else {
      return res.status(404).json({ message: "Book not found" }); // Return an error if the book is not found
    }
});

module.exports.general = public_users;
