"use strict";
var pg = require('pg');
var urlencode = require('urlencode');
var request = require('request');
const AWS = require('aws-sdk');
const fs = require('fs');
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

//AWS Setup
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

var bucketParams = {
  Bucket: process.env.S3_BUCKET_NAME, Key: 'APPS/TEST/MMSTW/TW99999999_20211111_test1.jpg'
}
module.exports.dbSelect = function(){
  s3.getObject(bucketParams, function(err, data){
    if(err){
      console.log("Error", err);
    } else {
      const body = Buffer.from(data.Body).toString('UTF-8');
      console.log("Success", body);
    }

  });
}
/*
module.exports.dbSelect = function(){
    
    const sql = `SELECT cust_id, phone_no, msg_id, msg_subject_adj, msg_body_text_adj, msg_body_image_adj_file, msg_type, plan_date, send_date, success_yn FROM transmit WHERE cust_id = 'KR00000004'`
  
    client.query(sql, (err, res) => {
      if(err){
        console.log(err.stack);
      } else {
        //console.log(res.rows);
        for(const row of res.rows){
          var cust_id = urlencode(row.cust_id);
          var dest = urlencode(row.phone_no);
          var msg_id = urlencode(row.msg_id);
          var subject = urlencode(row.msg_subject_adj);
          var msg = urlencode(row.msg_body_text_adj);
          console.log('msg:'+`\n`+msg);
          console.log('msg length: ' +msg.length+ `\n`);
          var msg_body_image_adj_file = urlencode(row.msg_body_image_adj_file);
          var msg_type = urlencode(row.msg_type);
          var plan_date = urlencode(row.plan_date);
          var time = urlencode(row.send_date);
          var success_yn = urlencode(row.success_yn);

          console.log("Call sendMsg function====================================================");
          //sendMsg(subject, msg, dest, time);
        }
      }
    })
  }

function sendMsg(subject, msg, dest, time){
    const url = 'https://oms.every8d.com/API21/HTTP/sendSMS.ashx';
    const uid = process.env.Euid;
    const password = process.env.Epassword;

    var geturl = url+'?UID='+uid+'&PWD='+password+'&SB='+subject+'&MSG='+msg+'&DEST='+dest+'&ST='+time;
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
        var tmp = response.body;
        var result = tmp.split(',');
        var msg_batch_id = result[4];        
        updateBatchId(dest, msg_batch_id);
    })
}

function updateBatchId(dest, msg_batch_id){
    var phone_no = dest;
    var batch_id = msg_batch_id
    console.log('batch_id= '+batch_id);
    
    const sql = `UPDATE transmit SET phone_no = t.phone_no, batch_id = t.batch_id 
                 FROM 
                    (VALUES
                    ('`+phone_no+`', '`+batch_id+`')
                )
                AS t(phone_no, batch_id)
                WHERE transmit.phone_no = t.phone_no`
    console.log(sql);

    client.query(sql, (err, res) => {
        if(err){
          console.log(err.stack);
        } else {
          console.log("Batch Id Update Completed");
        }
      })
}
*/