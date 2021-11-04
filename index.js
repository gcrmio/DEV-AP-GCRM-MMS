var express = require('express');
var request = require('request');
var app = express();
var pg = require('pg');
/*
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
*/

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

//PG_SELECT FROM transmit
function dbSelect(){
    const sql = `SELECT cust_id, phone_no, msg_id, msg_subject_adj, msg_body_text_adj, msg_body_image_adj_file, msg_type, plan_date, send_date, success_yn FROM transmit`
  
    client.query(sql, (err, res) => {
      if(err){
        console.log(err.stack);
      } else {
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        console.log(res.rows);
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        for(const row of res.rows){
          var cust_id = row.cust_id;
          var phone_no = row.phone_no;
          var msg_id = row.msg_id;
          var msg_subject_adj = row.msg_subject_adj;
          var msg_body_text_adj = row.msg_body_text_adj;
          var msg_body_image_adj_file = row.msg_body_image_adj_file;
          var msg_type = row.msg_type;
          var plan_date = row.plan_date;
          var send_date = row.send_date;
          var success_yn = row.success_yn;

          console.log('length of cust_id = '+cust_id.length);
          console.log('length of phone_no = '+phone_no.length);
          console.log('length of msg_id = '+msg_id.length);
          console.log('length of msg_subject_adj = '+msg_subject_adj.length);
          console.log('length of msg_body_text_adj = '+msg_body_text_adj.length);
          console.log('length of msg_body_image_adj_file = '+msg_body_image_adj_file.length);
          console.log('length of msg_type = '+msg_type.length);
          console.log('length of plan_date = '+plan_date.length);
          console.log('length of send_date = '+send_date.length);
          console.log('length of success_yn = '+success_yn.length);

        //   try {
            // send_message(mobile, sb, msg);
            // console.log(sid+' has successfully sent');
        //   } catch (error) {
            // console.log('send message error');
        //   }
        }
        // console.log('*************************************************************');
        // console.log(res.rows);
      }
    })
  }
