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



function updateDE(access_token, phone_no){
    var payload2 = [];
    var pKey = {};
    var pValue = {};

    //Get send complete transmit records
    const sql = `SELECT cust_id, phone_no, send_date, success_yn FROM transmit`;

    client.query(sql, (err, res) => {
    // if(err){
    //     console.log(err.stack);
    // } else {
        for(const row of res.rows){
            var pg_cust_id = row.cust_id;
            var pg_send_status_yn = row.success_yn;
            addPayload(pg_cust_id, pg_send_status_yn);
        }
    })

    function addPayload(pg_cust_id, pg_send_status_yn){
        pKey.cust_id = pg_cust_id;
        pValue.send_status_yn = pg_send_status_yn;
        payload2.push({keys: pKey, values: pValue});
    }

    console.log("111111111111");
    console.log(payload2);
    // var payload2 = [
        // {
            // "keys":{
                    // "cust_id": "TW702456915"
                    // },
            // "values":{
                    // "send_status_yn": "Y"
                    // }
        // },
        // {
            // "keys": {
                    // "cust_id": "TW702456917"
                    // },
            // "values":{
                    // "send_status_yn": "Y"
                    // }
        // }
    // ]
    
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

    // request(DEputOptions, function(error, response){
        // console.log(error, response.body);
    // })
}