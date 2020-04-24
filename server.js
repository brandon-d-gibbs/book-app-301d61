'use strict'

// Keep stuff hidden
require('dotenv').config();

// Let's plug it in
const express = require('express');
const app = express();

// *** Dependencies ***
const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
const methodOverride = require('method-override');

// *** Plug it in ***
// EJS
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
// Method Override
app.use(methodOverride('_method'));

// PORT
const PORT = process.env.PORT || 3015

// *** Routes ***
app.get('/', renderHome);
app.get('/searches/new', newSearch);
app.post('/searches', collectFormData);
app.post('/books', addToCollection);
app.get('/books/:id', showBookDetails);
app.get('*', (request, response) => response.status(404).render('./pages/error', {errorMessage: 'Page not found', errorCorrect: 'The path you took, leads only here. Some would call this, "nowhere".'}));


// *** Callback Functions ***
function renderHome(request, response){
    let sql = 'SELECT * FROM books;';
    
    client.query(sql)
    .then(results => {
        let resultsData = results.rows;
        let collectionCount = results.rows.length;
            
        response.status(200).render('pages/index', {book: resultsData, count: collectionCount});

        }).catch((err) => {
            console.error('Error when getting form data: ', err);
            response.status(500).render('./pages/error', {errorMessage: 'Could not retrieve book results from Database.', errorCorrect: 'Ensure that your database is properly connected.'});
          }) 
}

function newSearch(request, response){    
    response.status(200).render('./pages/searches/new');
}

function collectFormData(request, response){
    let search = request.body;
    let searchText = search.searchQuery;
    
    let radioSelected = search.search
    let url = `https://www.googleapis.com/books/v1/volumes?q=+${radioSelected}:${searchText}&maxResults=10`;


    superagent.get(url)
        .then((results) => results.body.items.map(obj => new Book(obj.volumeInfo)))      
        .then((book) => response.status(200).render('./pages/books/show', {book: book}))
        .catch((err) => {
            console.error('Error when getting form data: ', err);
            response.status(500).render('./pages/error', {errorMessage: 'Could not retrieve book results from API', errorCorrect: 'Make sure that your inputs are correct: API link and path.'});
          })            
}

function showBookDetails(request, response) {
    let id = request.params.id;
    let sql = 'SELECT * FROM books WHERE id=$1;';
    let safeValues = [id];

    client.query(sql, safeValues)
        .then(results => response.render('./pages/books/details', {book: results.rows}))
        .catch((err) => {
            console.log('Error showing book details', err)
            response.status(500).render('./pages/error', {errorMessage: 'Could not show book details', errorCorrect: 'Yeah, I am not sure what you did there.'})
        })
}

function addToCollection(request, response) {
    let{title, authors_names, description, isbn, bookshelf, imageurl} = request.body;
    console.log('request dat body', request.body);
    let sql = `INSERT INTO books (title, authors_names, description, isbn, bookshelf, imageurl) VALUES ($1, $2, $3, $4, $5,$6) RETURNING id;`;
    let safeValues = [title, authors_names, description, isbn, bookshelf, imageurl];
    console.log('Try again', sql, safeValues);
    client.query(sql, safeValues)
        .then(results => {
            console.log('results!!!', results.rows[0].id)
            response.status(200).redirect(`./books/${results.rows[0].id}`)
        })
        .catch((err) => {
            console.log('Error rendering template data from DB /addToCollection', err)
            response.status(500).render('./pages/error', {errorMessage: 'Could not add books to DB or show them.', errorCorrect: 'Yeah, I am not sure what you did there.'})
        })
}

function handleErrors(error, request, response){
    response.status(500).render('./pages/error');
}

// *** Constructor Functions ***
function Book(obj) {
    this.title = obj.title;
    this.authors_names = obj.authors;
    this.description = obj.description;
    this.isbn = obj.industryIdentifiers[0].identifier;
    this.bookshelf = obj.bookshelf;
    if(obj.imageLinks){
        this.imageurl = obj.imageLinks.thumbnail ? obj.imageLinks.thumbnail : url('./styles/img/book-placeholder.png');
    }
}

// Turn it on
client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Hey, you like books? Let\'s start looking for some. In case you need to know, we\'re doing this on ${PORT}`);            
        })
    }).catch(error => {
        console.log('No server for you. Is your Database running? Is your port taken?');
        response.status(500).send(error);
    }); 