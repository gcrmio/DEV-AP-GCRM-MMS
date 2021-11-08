"use strict";
var request = require('request');

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
        var sms_count = result[0];
        console.log("sms_count= "+sms_count);
        var sms_name = result[1];
        console.log("sms_name= "+sms_name);
        var sms_mobile = result[2];
        console.log("sms_mobile= "+sms_mobile);
        var sms_send_time = result[3];
        console.log("sms_send_time= "+sms_send_time);
        var sms_cost = result[4];
        console.log("sms_cost= "+sms_cost);
        var sms_status = result[5];
        console.log("sms_status= "+sms_status);
    })
}