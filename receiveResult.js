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
        var tmp = response.body
        var sms_count = tmp.sms_count;
        console.log(sms_count);
        var sms_name = tmp.name;
        console.log(sms_name);
        var sms_mobile = tmp.mobile;
        console.log(sms_mobile);
        var sms_send_time = tmp.send_time;
        console.log(sms_send_time);
        var sms_cost = tmp.cost;
        console.log(sms_cost);
        var sms_status = tmp.status;
        console.log(sms_status);
    })
}