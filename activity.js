"use strict";
var request = require('request');

module.exports.checkapi = function(req, res){
    var payload = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "client_credentials",
        account_id: process.env.ACCOUNT_ID
    };
    var clientServerOptions = {
        uri: 'https://mcycnrl05rhxlvjpny59rqschtx4.auth.marketingcloudapis.com/v2/token',
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    function getToken(){
        return new Promise(function(resolve, reject){
            request(clientServerOptions, function(error, response){
                resolve(response);
            });
        });
    };

    getToken().then(function(response){
        var tmp = JSON.parse(response.body);
        console.log("TOKEN==================================================");
        console.log(tmp.access_token);
        console.log("=======================================================");

        updateDE(tmp.access_token);
    });
    res.status(200).send('CheckAPI Response');
};


function updateDE(access_token){

    var payload2 = {
        "keys":{
            "cust_id": "TW702456915"
        },
        "values":{
            "send_status_yn": "Y"
        }
    }
    var DEputOptions = {
        uri: 'https://mcycnrl05rhxlvjpny59rqschtx4.rest.marketingcloudapis.com/hub/v1/dataevents/9fc86fa4-4c40-ec11-ba40-f40343ce83b8/rowset',
        body: JSON.stringify(payload2),
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token,
        },
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "client_credentials",
        account_id: process.env.ACCOUNT_ID
    }

    request(DEputOptions, function(error, response){
        console.log(error, response.body);
    })
}