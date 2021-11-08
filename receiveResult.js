"use strict";
var request = require('request');
var pg = require('pg');
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

module.exports.sendStat = function(BID){
    const url = 'https://oms.every8d.com/API21/HTTP/getDeliveryStatus.ashx';
    const uid = process.env.Euid;
    const password = process.env.Epassword;
    var bidValue = BID;
    console.log('bidValue= '+bidValue);
    var geturl = url+'?UID='+uid+'&PWD='+password+'&BID='+bidValue+'&PNO=';
    console.log(geturl);
    console.log('======================');
    request.get({
        url: geturl
    }, function(error, response, html){
        if(error){
            console.log(error);
        }
        console.log('Received Server Data!');
        var tmp = response.body;
        var result = tmp.replace(/\r?\n|\r/g, `\t`).split(`\t`);
        // var sms_count = result[0];
        // console.log("sms_count= "+sms_count);
        // var sms_name = result[1];
        // console.log("sms_name= "+sms_name);
        var sms_mobile = result[2];
        var sms_send_time = result[3];
        // var sms_cost = result[4];
        // console.log("sms_cost= "+sms_cost);
        var sms_status = result[5];
        updateTransmit(sms_mobile, sms_send_time, sms_status);
    })
}

function updateTransmit(sms_mobile, sms_send_time, sms_status){
    var phone_no = sms_mobile.replace('+','');
    var send_date = sms_send_time;
    var success_yn = sms_status="100"? "Y":"N";

    const sql = `UPDATE transmit SET phone_no = t.phone_no, send_date = t.send_date, success_yn = t.success_yn 
                 FROM 
                    (VALUES
                    ('`+phone_no+`', '`+send_date+`', '`+success_yn+`')
                )
                AS t(phone_no, send_date, success_yn)
                WHERE transmit.phone_no = t.phone_no`
    console.log(sql);

    client.query(sql, (err, res) => {
        if(err){
          console.log(err.stack);
        } else {
          console.log("Update Completed");
        }
      })
}