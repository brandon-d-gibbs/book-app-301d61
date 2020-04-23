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

// Get EJS plugged in
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

// PORT
const PORT = process.env.PORT || 3015

// *** Routes ***
app.get('/', renderHome);
app.get('/searches/new', newSearch);
app.post('/searches', collectFormData);
// app.get('*', );


// *** Callback Functions ***
function renderHome(request, response){
    let sql = 'SELECT * FROM books;';
    
    client.query(sql)
    .then(results => {
        let resultsData = results.rows;
        let collectionCount = results.rows.length;
            
        response.status(200).render('pages/index', {book: resultsData, count: collectionCount});

        }).catch(error => handleErrors(error, request, response)) 
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
        .then((book) => response.status(200).render('./pages/searches/show', {book: book}))
        .catch(error => handleErrors(error, request, response));             
}

function handleErrors(error, request, response){
    response.status(500).render('./pages/error');
}

// *** Constructor Functions ***
function Book(obj) {
    this.title = obj.title;
    this.authors_names = obj.authors;
    this.description = obj.description;
    this.isbn = obj.industryIndetifiers;
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