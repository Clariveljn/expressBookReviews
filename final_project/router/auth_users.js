const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
  };

  const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
  };

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message:"Error en login"});
  }

  if(authenticatedUser(username,password)){

    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({
      message:"Usuario autenticado correctamente"
    });
  }

  return res.status(208).json({message:"Usuario o contraseña inválidos"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    const review = req.query.review;

    books[isbn].reviews[username] = review;

    return res.status(200).json({
     message:"Reseña agregada/modificada correctamente"
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
