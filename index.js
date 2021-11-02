var express = require('express');
var request = require('request');
var app = express();
var http, options, proxy, url;

http = require("http");

url = require("url");

proxy = url.parse(process.env.QUOTAGUARDSTATIC_URL);
target  = url.parse("http://ip.quotaguard.com/");

options = {
  hostname: proxy.hostname,
  port: proxy.port || 80,
  path: target.href,
  headers: {
    "Proxy-Authorization": "Basic " + (new Buffer(proxy.auth).toString("base64")),
    "Host" : target.hostname
  }
};

http.get(options, function(res) {
  res.pipe(process.stdout);
  return console.log("status code", res.statusCode);
});

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
    res.render('every8D.html');
})