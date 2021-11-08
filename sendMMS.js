var request = require('request');

function dbSelect(){
    
    const sql = `SELECT cust_id, phone_no, msg_id, msg_subject_adj, msg_body_text_adj, msg_body_image_adj_file, msg_type, plan_date, send_date, success_yn FROM transmit`
  
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
          sendMsg(subject, msg, dest, time);
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
    })
}