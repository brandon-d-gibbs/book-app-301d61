'use strict'

// Keep stuff hidden
require('dotenv').config();

// Let's plug it in
const express = require('express');
const app = express();

// *** Dependencies ***
// const superagent = require('superagent');

// Get EJS plugged in
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

// PORT
const PORT = process.env.PORT || 3015

// *** Routes ***
app.get('/', renderHome);
app.get('/searches/new', newSearch);


// *** Callback Functions ***
function renderHome(request, response){
    response.status(200).render('./pages/index.ejs');
}

function newSearch(request, response){
    response.status(200).render('./pages/searches/new');

}





// Turn it on
app.listen(PORT, () => {
    console.log(`Hey, you like books? Let\'s start looking for some. In case you need to know, we\'re doing this on ${PORT}`);
})