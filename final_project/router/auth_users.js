const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid (not already registered)
const isValid = (username) => {
  return !users.some(user => user.username === username);
}

// Authenticate the user by username and password
const authenticatedUser = (username, password) => { 
  return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "username e/o password mancanti"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken, username };
        return res.status(200).json({ message: "login avvenuto con successo" });
    } else {
        return res.status(401).json({ message: "login non valido. prego inserire username e password" });
    }
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;

    if (!review) {
      return res.status(400).json({message: "La descrizione è mancante"});
  }

    if (!books[isbn]) {
        return res.status(404).json({message: "Libro non trovato"});
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({message: `la descrizione del libro con ISBN ${isbn} è stata aggiunta o aggiornata`});
});

// Delete a review posted by the user
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({message: "libro non trovato"});
    }

    if (!books[isbn].reviews[username]) {
        return res.status(404).json({message: "la descrizione non ha dato risultati"});
    }

    delete books[isbn].reviews[username];
    return res.status(200).json({message: `la descrizione di ${username} per ISBN ${isbn} è stata eliminata`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
