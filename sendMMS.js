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
  const sql = `SELECT cust_id, phone_no, msg_id, msg_subject_adj, msg_body_text_adj, msg_body_image_adj_file, msg_type, plan_date, send_date, success_yn FROM transmit WHERE cust_id IN ('TW99999999', 'TW99999998')`

  pool.query(sql, (err, res) => {
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
        var msg_body_image_adj_file = urlencode(row.msg_body_image_adj_file);
        var msg_type = urlencode(row.msg_type);
        var plan_date = urlencode(row.plan_date);
        var time = urlencode(row.send_date);
        var success_yn = urlencode(row.success_yn);
        var bucketParams = {
          Bucket: process.env.S3_BUCKET_NAME, Key: 'APPS/TEST/MMSTW/'+cust_id+'_'+plan_date+'_test1.jpg'
        }
        s3.getObject(bucketParams, function(err, data){
          if(err){
            console.log("Error", err);
          } else {
            var img = Buffer.from(data.Body, 'utf8').toString('base64');
            var attachment = urlencode(img);
            sendMsg(subject, msg, dest, time, attachment);
          }
        });
        console.log("Call sendMsg function====================================================");
        //sendMsg(subject, msg, dest, time);
      }
    }
  })


function sendMsg(subject, msg, dest, time, attachment){
    const url = 'https://oms.every8d.com/API21/HTTP/MMS/sendMMS.ashx';
    const uid = process.env.Euid;
    const password = process.env.Epassword;
    const type = 'jpg';
    var retrytime = '1440';
    var geturl = url+'?UID='+uid+'&PWD='+password+'&SB='+subject+'&MSG='+msg+'&DEST='+dest+'&ST='+time+'&RETRYTIME='+retrytime+'&ATTACHMENT='+attachment+'&TYPE='+type;
    console.log(geturl);
    console.log('========================================GETURL=============================================================================');
    request.get({
        url: geturl
    }, function(error, response, html){
        if(error){
            console.log(error);
        }
        console.log('Received Server Data!');
        // console.log(html);
        // var tmp = response.body;
        //var result = tmp.split(',');
        console.log(response.body);
        //var msg_batch_id = result[4];        
        //updateBatchId(dest, msg_batch_id);
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

    pool.query(sql, (err, res) => {
        if(err){
          console.log(err.stack);
        } else {
          console.log("Batch Id Update Completed");
        }
      })
}
}