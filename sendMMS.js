"use strict";
var pg = require('pg');
var urlencode = require('urlencode');
var request = require('request');
const {Pool, Client} = require('pg');
const AWS = require('aws-sdk');

const pool = new Pool({
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    port: process.env.DB_port,
    ssl: {
      rejectUnauthorized: false
    }
});

const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

module.exports.dbSelect = function(){
  const sql = `SELECT cust_id, phone_no, msg_id, msg_subject_adj, msg_body_text_adj, msg_body_image_adj_file, msg_type, plan_date, send_date, success_yn FROM transmit WHERE cust_id IN('TW99999999')`

  pool.query(sql, (err, res) => {
    if(err){
      console.log(err.stack);
    } else {
      //console.log(res.rows);
      for(const row of res.rows){
        var cust_id = row.cust_id;
        var dest = row.phone_no;
        var subject = row.msg_subject_adj;
        var msg = row.msg_body_text_adj;
        var time = row.send_date;
        var msg_type = row.msg_type;
        switch(msg_type){
          case 'MMS':
            var bucketParams = {
              Bucket: process.env.S3_BUCKET_NAME, Key: 'APPS/TEST/MMSTW/'+cust_id+'_20211111_test1.jpg'
            }
            s3.getObject(bucketParams, function(err, data){
              if(err){
                console.log("Error", err);
              } else {
                var attachment = Buffer.from(data.Body, 'utf8').toString('base64');
                sendMMS(subject, msg, dest, time, attachment);
                console.log('SEND MMS TO: '+cust_id);
              }
            });
            break;
          case 'SMS':
            sendSMS(subject, msg, dest,time);
            console.log('SEND SMS TO: '+cust_id);
            break;
          default:
            sendSMS(subject, msg, dest,time);
            console.log('SEND SMS TO: '+cust_id);
            break;
        }
      }
    }
  })

function sendMMS(subject, msg, dest, time, attachment){
    const uid = process.env.Euid;
    const password = process.env.Epassword;
    const type = 'jpeg';
    console.log(dest);
    console.log('dest==================');
    var options = {
      'method': 'GET',
      'url': 'https://oms.every8d.com/API21/HTTP/MMS/sendMMS.ashx',
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        'UID': process.env.Euid,
        'PWD': process.env.Epassword,
        'SB': subject,
        'MSG': msg,
        'DEST': dest,
        'ST': time,
        'TYPE': type,
        'ATTACHMENT': attachment
      }
    };
    // request(options, function (error, response) {
      // if (error) throw new Error(error);
      // var tmp = response.body;
      // var result = tmp.split(',');
      // var msg_batch_id = result[4];
      // updateBatchId(dest, msg_batch_id);
    // });
}

function sendSMS(subject, msg, dest, time){
  const uid = process.env.Euid;
  const password = process.env.Epassword;
  const type = 'jpeg';
  console.log(dest);
  console.log('dest==================');
  var options = {
    'method': 'GET',
    'url': 'https://oms.every8d.com/API21/HTTP/sendSMS.ashx',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      'UID': process.env.Euid,
      'PWD': process.env.Epassword,
      'SB': subject,
      'MSG': msg,
      'DEST': dest,
      'ST': time
    }
  };
  // request(options, function (error, response) {
    // if (error) throw new Error(error);
    // var tmp = response.body;
    // var result = tmp.split(',');
    // var msg_batch_id = result[4];
    // updateBatchId(dest, msg_batch_id);
  // });
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

    pool.query(sql, (err, res) => {
        if(err){
          console.log(err.stack);
        } else {
          console.log("Batch Id Update Completed");
        }
      })
}
}