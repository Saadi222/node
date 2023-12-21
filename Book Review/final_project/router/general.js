const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({message: "Username or Password input is missing"});
  }
  if (!isValid(req.body.username)) {
    return res.status(400).json({message: "Username already exist"});
  }
  users.push({"username": req.body.username, "password": req.body.password});
  return res.status(201).send();
});

// Async: Get the book list available in the shop
public_users.get('/async/', async function (req, res) {
  // return res.status(200).send(JSON.stringify(books));
  try {
    const response = await axios.get('http://localhost:5000/');
    if (response.data != null) {
      return res.status(200).json(response.data);
    }
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({message: "Internal Error"});
  }
});

// Async: Get book details based on ISBN
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
    if (response.data != null) {
      return res.status(200).json(response.data);
    }
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({message: "Internal Error"});
  }
 });
  
// Async: Get book details based on author
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
    if (response.data != null) {
      return res.status(200).json(response.data);
    }
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({message: "Internal Error"});
  }
});

// Async: Get all books based on title
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
    if (response.data != null) {
      return res.status(200).json(response.data);
    }
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({message: "Internal Error"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).send();
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author_books = [];
  for (isbn in books) {
    if (books[isbn]['author'] === req.params.author) {
      author_books.push(books[isbn]);
    }
  }
  return res.status(200).json(author_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let books_w_title = [];
  for (isbn in books) {
    if (books[isbn]['title'] === req.params.title) {
      books_w_title.push(books[isbn]);
    }
  }
  return res.status(200).json(books_w_title);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  if (books[isbn]) {
    return res.status(200).json(books[isbn]['reviews']);
  }
  return res.status(404).send();
});

module.exports.general = public_users;