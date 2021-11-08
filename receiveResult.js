"use strict";
var request = require('request');
var pg = require('pg');

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

    const sql = `UPDATE transmit as t set send_date = c.send_date, success_yn = c.success_yn 
                 FROM (VALUES
                    (`+phone_no+`, `+send_date+`, `+success_yn+`)
                ) AS c(phone_no, send_date, success_yn)
                WHERE c.phone_no = t.phone_no`
    console.log(sql);
/*
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
      */
}