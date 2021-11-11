var express = require('express');
var request = require('request');
var urlencode = require('urlencode');
var app = express();
var pg = require('pg');
var sendMMS = require('./sendMMS');
var loadResult = require('./loadResult');
var receiveResult = require('./receiveResult');
const AWS = require('aws-sdk');
// var http, options, proxy, url;
// http = require("http");
// url = require("url");
// proxy = url.parse(process.env.QUOTAGUARDSTATIC_URL);

// //proxy setup
// target  = url.parse("https://ap-gcrm-mms.herokuapp.com/");
// options = {
//   hostname: proxy.hostname,
//   port: proxy.port || 80,
//   path: target.href,
//   headers: {
//     "Proxy-Authorization": "Basic " + (new Buffer(proxy.auth).toString("base64")),
//     "Host" : target.hostname
//   }
// };

// http.get(options, function(res) {
//   res.pipe(process.stdout);
//   return console.log("status code", res.statusCode);
// });

//Render Every8D page
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"),
function(){
    console.log("ap-gcrm-mms heroku app is running on ["+app.get("port")+"]");
});

//00. Main
app.get('/', (req, res) => {
    res.send('AP-GCRM-MMS APP');
})

//02. Send MMS
app.get('/sendMMS', (req, res) => {
    // try {
        // console.log("sendMsg=======================================");
        sendMMS.dbSelect();
        res.send('Send Msg Complete!');
    // } catch (error) {
        // console.log('There was an error!');
    // }
})

//03. Receive Result
app.get('/receiveResult', (req, res) => {
  console.log('Receive Result===============================');
  receiveResult.listSelect();
  res.send('Receive Result Complete!');
})
// app.get('/receiveResult/:BID', (req, res) => {

//         console.log("sendStat=======================================");
//         var BID = req.params.BID;
//         receiveResult.sendStat(BID);
//         res.send('Send Stat Complete!');
// })


//04. Load Result
app.get('/loadResult', (req, res) => {
  // try {
    console.log("updateDE=======================================");
    loadResult.checkapi(req, res);
    res.send('updateDE Complete!');
  // } catch (error) {
  //     console.log('There was an error!');
  // }
})

app.get('/credit', (req, res) => {
    try {
        console.log("credit=======================================");
        receiveCredit();
        res.send('credit Complete!');
    } catch (error) {
        console.log('There was an error!');
    }
})

function receiveCredit(){
  const url = 'https://oms.every8d.com/API21/HTTP/getCredit.ashx';
  const uid = process.env.Euid;
  const password = process.env.Epassword;

  var geturl = url+'?UID='+uid+'&PWD='+password;
  console.log(geturl);
  console.log('======================');
  request.get({
      url: geturl
  }, function(error, response, html){
      if(error){
          console.log(error);
      }
      console.log('Received Server Data!');
      console.log(html);
  })
}