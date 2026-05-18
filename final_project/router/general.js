const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const doesExist = (username) => {
    return users.some(user => user.username === username);
  };


public_users.post("/register", (req,res) => {
    const username = req.body.username;
  const password = req.body.password;

  if(username && password){

    if(!doesExist(username)){

      users.push({
        username: username,
        password: password
      });

      return res.status(200).json({message:"Usuario registrado correctamente"});
    }

    return res.status(404).json({message:"Usuario ya existe"});
  }

  return res.status(404).json({message:"No se pudo registrar usuario"});
});

// Get the book list available in the shop
public_users.get('/async/books', async function (req, res) {

  const response = await axios.get('http://localhost:5000/');

  return res.status(200).json(response.data);

});

// Get book details based on ISBN
public_users.get('/async/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

  return res.status(200).json(response.data);

});
  
// Get book details based on author
public_users.get('/async/author/:author', async function (req, res) {

  const author = req.params.author;

  const response = await axios.get(`http://localhost:5000/author/${author}`);

  return res.status(200).json(response.data);

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    let filteredBooks = Object.keys(books)
      .filter(key => books[key].title === title)
      .reduce((result,key)=>{
        result[key] = books[key];
        return result;
      }, {});
  
    return res.status(200).json(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
