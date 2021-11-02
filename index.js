'use strict';
var express = require('express');
var request = require('request');
var app = express();

var url = require('url');
var HttpsProxyAgent = rerquire('https-proxy-agent');
var request = require('request');

var testEndpoint = 'https://ap-gcrm-mms.herokuapp.com/';
var proxy = process.env.QUOTAGUARDSHIELD_URL;
var agent = new HttpsProxyAgent(proxy);
var options = {
    url: url.parse(testEndpoint),
    agent
};

function callback(error, response, body){
    if(!error && response.statusCode == 200){
        console.log('body: ', body);
    } else{
        console.log('error: ', error);
    }
}

try {
    console.log('CALLBACK =====================================');
    request(options, callback); 
} catch (error) {
    console.log('there was an error');
}

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"),
function(){
    console.log("ap-gcrm-mms heroku app is running on ["+app.get("port")+"]");
});

app.get('/', (req, res) => {
    res.send('AP-GCRM-MMS APP');
})

app.get('/Every8D', (req, res) => {
    console.log('Accessing Every8D');
    res.render('every8D.html');
})