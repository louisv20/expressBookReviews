const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get the book list available in the shop
public_users.get('/books', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(books);
  });

  get_books.then((books) => {
    console.log("Promise for task 10 resolved");
  })

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
     book.isbn = undefined;
    return res.status(200).json( book );
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
 });
//Get book details based on ISBN using Promises
public_users.get('/books/isbn/:isbn',function (req, res) {
  const get_books_isbn = new Promise((resolve, reject) => {
  const isbn = req.params.isbn;
      if (req.params.isbn <= 10) {
      resolve(res.send(books[isbn]));
  }
      else {
          reject(res.send('ISBN not found'));
      }
  });
  get_books_isbn.
      then(function(){
          console.log("Promise for Task 11 is resolved");
 }).
      catch(function () { 
              console.log('ISBN not found');
});

});
  
// Get book details based on author
public_users.get('/author/:author', function(req, res) {s
  const author = req.params.author;
  const booksbyauthor = [];

  for (const isbn in books) {
    const book = books[isbn];
    if (book.author === author) {
      const { author, ...filteredBook } = book; 
      booksbyauthor.push(filteredBook);
    }
  }

  if (booksbyauthor.length > 0) {
    return res.status(200).json({ booksbyauthor });
  } else {
    return res.status(404).json({ message: "Books by author not found" });
  }
});

public_users.get('/books/author/:author', function (req, res) {
  const author = req.params.author;
  const get_books_author = new Promise((resolve, reject) => {
    const authors = Object.values(books).filter(book => book.author === author);
    if (authors.length > 0) {
      resolve(authors);
    } else {
      reject(new Error('Author not found'));
    }
  });

  get_books_author.then((authors) => {
    console.log("Promise for Task 12 is resolved");
    res.status(200).json(authors);
  }).catch((error) => {
    console.log('Error:', error.message);
    res.status(404).send('Author not found');
  });
});


// Get book details based on title
public_users.get('/title/:title', function(req, res) {
  const title = req.params.title;
  const booksbytitle = [];

  for (const isbn in books) {
    const book = books[isbn];
    if (book.title === title) {
      const { title, ...filteredBook } = book; 
      booksbytitle.push(filteredBook);
    }
  }

  if (booksbytitle.length > 0) {
    return res.status(200).json({ booksbytitle });
  } else {
    return res.status(404).json({ message: "Books by title not found" });
  }
});

public_users.get('/books/title/:title', function (req, res) {
  const title = req.params.title;
  const get_books_title = new Promise((resolve, reject) => {
    const titles = Object.values(books).filter(book => book.title === title);
    if (titles.length > 0) {
      resolve(titles);
    } else {
      reject(new Error('title not found'));
    }
  });

  get_books_title.then((titles) => {
    console.log("Promise for Task 13 is resolved");
    res.status(200).json(titles);
  }).catch((error) => {
    console.log('Error:', error.message);
    res.status(404).send('title not found');
  });
});

//  Get book review
public_users.get('/review/:isbn', function(req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    book.reviews = undefined;
    return res.status(200).json({ reviews: book.reviews });
  } else {
    return res.status(404).json({ message: "Reviews not found for ISBN " + isbn });
  }
});



module.exports.general = public_users;
