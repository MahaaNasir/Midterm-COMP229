/*
File Name: books.js
Author: Maha Nasir
Student ID: 301266305
Web App name: My Favorite Books
*/

// modules required for routing
const { defaultMaxListeners } = require('events');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');


// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });
});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
    //render book details page with blank book info, so we add a new book
     res.render('books/details',{
      title: 'Add a Book',
      books : ''
    });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {
      //formates the book information
      let newBook = {
        Title: req.body.title,
        Description: req.body.description,
        Price: req.body.price,
        Author: req.body.author,
        Genre: req.body.genre
      }
    //creates a new book on database - MongoDB
    book.create(newBook, (err, createdBook)=> {
      if (err) {
        res.send(err);
      }
      else {
        res.redirect('/books');
      }
    });
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {
    //find book in the database by its ID
    book.findById(req.params.id, ( err, book) => {
      if (err) {
        return console.error(err);
      }
      // render the book details page with the retrieved book info
      else {
        res.render('books/details',{
        title: 'Edit the Book',
        books : book });
      }
    });
});


// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
    let id = req.params.id;

    // formats the edited info before updating the book
    let updatedBook = {
      Title: req.body.title,
      Description: req.body.description,
      Price: req.body.price,
      Author: req.body.author,
      Genre: req.body.genre
    }
    // update the book with the edited info
    book.updateOne({ _id: id }, updatedBook, (err, createdBook) => {
      // if no error, redirect to the books page after the update
      if (err) {
        return console.error(err);
      }
      else {
        res.redirect('/books');
      }
    });
});


// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
     let id = req.params.id;
    //remove the book from the database by book's ID
    book.remove({ _id: id }, (err) => {
      if (err) {
        return console.log(err);
      }
      else {
        //redirect to books page after deletion
        res.redirect('/books');
      }
    });
});  


module.exports = router;
