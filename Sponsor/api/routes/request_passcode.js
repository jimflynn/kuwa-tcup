const express = require("express");

const router = express.Router();

const crypto = require('crypto');

const fs = require("fs");

let properties = fs.readFileSync(".config.json");

properties = JSON.parse(properties);

const db = require("../../mysql_query");

const nodemailer = require('nodemailer');




/**
 * Function to generate a random passcode.
 * @param  {number} howMany number of characters in the passcode. Chosen 6 because it seems to be the standard followed by companies like google.
 * @param  {string} chars   the allowed characters in the passcode
 * @return {string}         The random passcode generated for the user request.
 */
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


/**
 * This function sends mail to the user informing them of their passcode generated to verify them in database.
 * @param  {string} passcode 
 * @param  {object} req      
 * @param  {object} res      
 *    
 */
var sendMail = async function(passcode, req, res) {

    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: properties['mailHost'],
            port: properties['mailPort'],
            secure: false, // true for 465, false for other ports
            auth: {
                user: properties['mailUser'], // generated ethereal user
                pass: properties['mailPassword'] // generated ethereal password
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
        });

    });

    db.getConnection(function(err, connection) {
      // Use the connection
      var sql_query = "INSERT INTO passcode_request (full_name, passcode, email, user_id) VALUES ('"+ req.fields.fullName+ "', '"+ passcode + "', '"+ req.fields.email +"'," + null + ")";
         
      connection.query( sql_query, function (error, row, fields) {

        // And done with the connection.
        connection.release();

        // Handle error after the release.
        if (error) console.log(error);

        // Don't use the connection here, it has been returned to the pool.
      });
    });

}


/**
 * This is the REST endpoint for the frontend to request the passcode from.
 */
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