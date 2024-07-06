const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check if username is a non-empty string and not already in the users array
  return username && !users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  // Check if the username and password match any user in the users array
  return users.find(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user is authenticated
  const user = authenticatedUser(username, password);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token
  const token = jwt.sign({ username }, "your_jwt_secret_key", { expiresIn: '1h' });

  return res.status(200).json({ message: "Login successful", token });
});

// Add or modify a book review
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

    // Add or modify the review
    let userReview = Object.values(books[isbn].reviews).find(review => review.username === username);
    if (userReview) {
      // Modify the existing review
      for (let reviewId in books[isbn].reviews) {
        if (books[isbn].reviews[reviewId].username === username) {
          books[isbn].reviews[reviewId].review = review;
          break;
        }
      }
    } else {
      // Add a new review
      const reviewId = Object.keys(books[isbn].reviews).length + 1;
      books[isbn].reviews[reviewId] = { username, review };
    }

    return res.status(200).json({ message: "Review added/modified successfully" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
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

    // Find and delete the user's review
    let reviewDeleted = false;
    for (let reviewId in books[isbn].reviews) {
      if (books[isbn].reviews[reviewId].username === username) {
        delete books[isbn].reviews[reviewId];
        reviewDeleted = true;
        break;
      }
    }

    if (reviewDeleted) {
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// Register a new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
