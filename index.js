var express = require('express');
var request = require('request');
var app = express();


request(options, callback);

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
    console.log('Accessing Every8D')
    var options = {
        proxy: process.env.QUOTAGUARDSTATIC_URL,
        url: 'https://api.github.com/repos/joyent/node',
        headers: {
            'User-Agent': 'node.js'
        }
    };
    
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    }
    res.render('every8D.html');
})