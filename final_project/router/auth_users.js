const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check if username is a non-empty string and not already in the users array
  if (username && !users.some(user => user.username === username)) {
    return true;
  }
  return false;
};

const authenticatedUser = (username, password) => {
  // Check if the username and password match any user in the users array
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user is authenticated
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token
  const token = jwt.sign({ username }, "your_jwt_secret_key", { expiresIn: '1h' });

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const token = req.headers['authorization'];

  // Check if token is provided
  if (!token) {
    return res.status(403).json({ message: "A token is required for authentication" });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key");
    const username = decoded.username;

    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Add the review to the book
    const reviewId = Object.keys(books[isbn].reviews).length + 1;
    books[isbn].reviews[reviewId] = { username, review };

    return res.status(200).json({ message: "Review added successfully" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
