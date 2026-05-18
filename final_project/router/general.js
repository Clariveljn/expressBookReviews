const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        const userExists = users.some(user => user.username === username);

        if (!userExists) {
            users.push({ username, password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        }

        return res.status(404).json({ message: "User already exists!" });
    }

    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list using async/await
public_users.get('/books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving book by ISBN" });
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books by author" });
    }
});

// Get book details based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books by title" });
    }
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;

