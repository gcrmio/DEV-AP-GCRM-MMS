var express = require('express');
var request = require('request');
var urlencode = require('urlencode');
var app = express();
var pg = require('pg');
const fetch = require('node-fetch');


var http, options, proxy, url;
http = require("http");
url = require("url");
proxy = url.parse(process.env.QUOTAGUARDSTATIC_URL);

//proxy setup
target  = url.parse("https://ap-gcrm-mms.herokuapp.com/");
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


//Render Every8D page
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"),
function(){
    console.log("ap-gcrm-mms heroku app is running on ["+app.get("port")+"]");
});

//PG Setup
const dbconfig = {
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    port: process.env.DB_port,
    ssl: {
      rejectUnauthorized: false
    }
  }
  
  console.log('PG Connect ==============================');
  const client = new pg.Client(dbconfig);
  client.connect(err =>{
    if(err){
      console.log('Failed to connect db ' + err);
    } else {
      console.log('Connect to db done!');
    }
  })

app.get('/', (req, res) => {
    res.send('AP-GCRM-MMS APP');
})

app.get('/Every8D', (req, res) => {
    console.log('Accessing Every8D');
    res.render('every8D.html');
})

app.get('/pgSelect', (req, res) => {
    try {
        console.log("PGSELECT=======================================");
        dbSelect();
        res.send('PG Select Complete!');
      } catch (error) {
        console.log('There was an error!');
      }
})

app.get('/sendMsg', (req, res) => {
    try {
        console.log("sendMsg=======================================");
        dbSelect();
        res.send('Send Msg Complete!');
    } catch (error) {
        console.log('There was an error!');
    }
})

//PG_SELECT FROM transmit
function dbSelect(){
    
    const sql = `SELECT cust_id, phone_no, msg_id, msg_subject_adj, msg_body_text_adj, msg_body_image_adj_file, msg_type, plan_date, send_date, success_yn FROM transmit`
  
    client.query(sql, (err, res) => {
      if(err){
        console.log(err.stack);
      } else {
        //console.log(res.rows);
        for(const row of res.rows){
          var cust_id = urlencode(row.cust_id);
        //   console.log('cust_id ' + cust_id);
          var dest = urlencode(row.phone_no);
        //   console.log('phone_no ' + dest);
          var msg_id = urlencode(row.msg_id);
        //   console.log('msg_id ' + msg_id);
          var subject = urlencode(row.msg_subject_adj);
        //   console.log('msg_subject_adj ' + subject);
          var msg = urlencode(row.msg_body_text_adj);
        //   console.log('msg_body_text_adj ' + msg);
          var msg_body_image_adj_file = urlencode(row.msg_body_image_adj_file);
        //   console.log('msg_body_image_adj_file ' + msg_body_image_adj_file);
          var msg_type = urlencode(row.msg_type);
        //   console.log('msg_type ' + msg_type);
          var plan_date = urlencode(row.plan_date);
        //   console.log('plan_date ' + plan_date);
          var time = urlencode(row.send_date);
        //   console.log('send_date ' + time);
          var success_yn = urlencode(row.success_yn);
        //   console.log('success_yn ' + success_yn);

          console.log("Call sendMsg function====================================================");
          sendMsg(subject, msg, dest, time);
        }
      }
    })
  }

function sendMsg(subject, msg, dest, time){
    const url = 'https://oms.every8d.com/API21/HTTP/sendSMS.ashx';
    const uid = process.env.Euid;
    const password = process.env.Epassword;
    var resultCode = 404;

    fetch(url, {

        headers:{
            'Content-Type': 'x-www-form-urlencoded; charset=UTF-8'
        },
        body: new URLSearchParams({
            UID: uid,
            PWD: password,
            SB: subject,
            MSG: msg,
            DEST: dest,
            ST: time
        })
    },
        function (err, res, html) {
            if (err) console.log(err);
            else { resultCode = 200; console.log(html); }
          }
        );
        return resultCode;
}