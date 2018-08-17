const express = require("express");

const router = express.Router();

const crypto = require('crypto');

const fs = require("fs");

const db = require("../../mysql_query");

const nodemailer = require('nodemailer');

// const sendmail = require('sendmail')({
//     logger: {
//     debug: console.log,
//     info: console.info,
//     warn: console.warn,
//     error: console.error
//   },
//     silent: false,
//     dkim: {

//     privateKey: fs.readFileSync('/etc/httpd/conf/ssl.key/server.key', 'utf8'),
//     keySelector: 'alpha'
//   },
//     smtpHost: 'mail.name.com',
//     smtpPort: 587
// });





//function for random passcode
var random = function (howMany, chars) {
      chars = chars
        || 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
    var rnd = crypto.randomBytes(howMany)
        , value = new Array(howMany)
        , len = len = Math.min(256, chars.length)
        , d = 256 / len

    for (var i = 0; i < howMany; i++) {
          value[i] = chars[Math.floor(rnd[i] / d)]
    };

    return value.join('');
}


var sendMail = async function(passcode, req, res) {

    //code for emailing the passcode.
    // sendmail({
    // from: 'no-reply@alpha.kuwa.org',
    // to: req.fields.email,
    // subject: 'Kuwa passcode for your registration.',
    // html: 'Your Kuwa passcode is '+ passcode,
    // }, function(err, reply) {
    // console.log(err && err.stack);
    // console.dir(reply);
    // });
    nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'mail.name.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'jim.flynn@kuwa.org', // generated ethereal user
            pass: '@Name.com1' // generated ethereal password
        }
    });


    let mailOptions = {
        from: 'no-reply@kuwa.org', // sender address
        to: req.fields.email, // list of receivers
        subject: 'Kuwa passcode for your registration.', // Subject line
        html: 'Your Kuwa passcode is <b>'+ passcode+'</b>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log(info);
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });

  });




    db.getConnection(function(err, connection) {
      // Use the connection
      var sql_query = "INSERT INTO passcode_request (full_name, passcode, email, user_id) VALUES ('"+ req.fields.fullName+ "', '"+ passcode + "', '"+ req.fields.email +"'," + null + ")";
         
      connection.query( sql_query, function (error, row, fields) {
      console.log(row);
      //console.log(fields);


      // And done with the connection.
      connection.release();

      // Handle error after the release.
      if (error) console.log(error);

    // Don't use the connection here, it has been returned to the pool.
      });
    });

}


router.post('/', (req, res, next) => {
    //console.log(req.fields.fullName);
    //console.log(req.fields.email);
    let passcode = random(6);
    
	  sendMail(passcode, req, res);
	


    res.status('200').json({
    message: "Passcode requested successfully"
    });
});

module.exports = router;