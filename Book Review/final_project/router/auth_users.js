const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  for (user in users) {
    if (user.username === username) {
      return false;
    }
  }
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({message: "Username or Password input is missing"});
  }
  const username = req.body.username;
  const password = req.body.password;
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } 
  else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  if (books[isbn]) {
    books[isbn]['reviews'][req.session.authorization.username] = req.body.review;
    return res.status(201).json(books[isbn]);
  }
  return res.status(404).send();
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  if (books[isbn]) {
    delete books[isbn]['reviews'][req.session.authorization.username];
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).send();
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
