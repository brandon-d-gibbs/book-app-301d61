'use strict'

// Keep stuff hidden
require('dotenv').config();

// Let's plug it in
const express = require('express');
const app = express();

// *** Dependencies ***
const superagent = require('superagent');

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


// *** Callback Functions ***
function renderHome(request, response){
    response.status(200).render('./pages/index.ejs');
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
        .then((results) => {
            console.log('books', results.body.items);
        })


    response.status(200).render('./pages/searches/show');
}

// *** Constructor Functions ***

// function newBook(book) {
//     this.img = 
// }


// Turn it on
app.listen(PORT, () => {
    console.log(`Hey, you like books? Let\'s start looking for some. In case you need to know, we\'re doing this on ${PORT}`);
})