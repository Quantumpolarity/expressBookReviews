const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
const public_users = express.Router();


const booksApiUrl = 'http://localhost:5000/books';


public_users.get('/', async (req, res) => {
  try {
    
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
});


public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    if (books[isbn]) {
      res.status(200).json(books[isbn]);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch book details", error: error.message });
  }
});


public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();
  try {
    
    const bookList = Object.values(books).filter(book => book.author.toLowerCase() === author);
    if (bookList.length > 0) {
      res.status(200).json(bookList);
    } else {
      res.status(404).json({ message: "Books not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch book details", error: error.message });
  }
});


public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();
  try {
   
    const bookList = Object.values(books).filter(book => book.title.toLowerCase() === title);
    if (bookList.length > 0) {
      res.status(200).json(bookList);
    } else {
      res.status(404).json({ message: "Books not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch book details", error: error.message });
  }
});

module.exports.general = public_users;
