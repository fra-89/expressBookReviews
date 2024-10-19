const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({message: "Username or password is missing"});
    }

    if (isValid(username)) {
        users.push({ username, password });
        return res.status(201).json({message: "Registration successful. You can now log in."});
    } else {
        return res.status(409).json({message: "This user is already registered"});
    }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const book = books[req.params.isbn];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({message: "libro non trovato"});
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === req.params.author);
    if (booksByAuthor.length > 0) {
        return res.status(200).json({booksByAuthor});
    } else {
        return res.status(404).json({message: "non sono stati trovati libri per questo autore"});
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const booksByTitle = Object.values(books).filter(book => book.title === req.params.title);
    if (booksByTitle.length > 0) {
        return res.status(200).json({booksByTitle});
    } else {
        return res.status(404).json({message: "non sono stati trovati libri con questo titolo"});
    }
});

// Get book review
public_users.get('/review/:isbn', async (req, res) => {
    const book = books[req.params.isbn];
    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({message: "libro non trovato"});
    }
});

module.exports.general = public_users;
