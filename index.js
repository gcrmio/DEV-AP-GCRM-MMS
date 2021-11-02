var express = require('express');
var app = express();

app.get('/', (req, res) => {
    res.send('AP-GCRM-MMS APP');
})

app.get('/Every8D', (req, res) => {
    console.log('Accessing Every8D')
    res.render('every8D.html');
})