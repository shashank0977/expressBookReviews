const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Internal data endpoint used by Axios
public_users.get("/internal/books", (req, res) => {
  res.status(200).json(books);
});

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: "User successfully registered"
  });
});

// Get all books
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/internal/books`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve books"
    });
  }
});

// Get book by ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/internal/books`);
    const book = response.data[req.params.isbn];

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve book"
    });
  }
});

// Get books by author
public_users.get("/author/:author", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/internal/books`);
    const author = req.params.author.toLowerCase();

    const result = Object.values(response.data).filter(
      (book) => book.author.toLowerCase().includes(author)
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "No books found for this author"
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve books"
    });
  }
});

// Get books by title
public_users.get("/title/:title", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/internal/books`);
    const title = req.params.title.toLowerCase();

    const result = Object.values(response.data).filter(
      (book) => book.title.toLowerCase().includes(title)
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "No books found with this title"
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve books"
    });
  }
});

// Get book reviews
public_users.get("/review/:isbn", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/internal/books`);
    const book = response.data[req.params.isbn];

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    return res.status(200).json(book.reviews);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve reviews"
    });
  }
});

module.exports.general = public_users;
