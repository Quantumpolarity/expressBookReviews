const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
const public_users = express.Router();

// URL of the external API endpoint for fetching book details by author
const booksApiUrl = 'http://localhost:5000/author'; // This is a placeholder URL

// Get book details based on author using Promises
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  axios.get(`${booksApiUrl}/${author}`)
    .then(response => {
      const bookList = Object.values(books).filter(book => book.author.toLowerCase() === author);
      if (bookList.length > 0) {
        res.status(200).json(bookList);
      } else {
        res.status(404).json({ message: "Books not found" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Failed to fetch book details", error: error.message });
    });
});

module.exports.general = public_users;
