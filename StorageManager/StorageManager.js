/**This is the storage manager service for handling incoming Kuwa registrations and 
storing them in the repository. 
Author - Hrishikesh Kashyap, Last Updated - 06/15/2018
*/
/**TODO: Make the port number and directory to save the file a config option*/

const port = process.env.PORT || 3003;

var express = require('express');
var formidable = require('formidable');
const bodyParser = require('body-parser');
const path = require('path');
var fs = require('fs-extra'); 
var fs1 = require('fs');
var app = express();
var https = require('https');
var http = require('http');


var options = {
 key: fs1.readFileSync('/etc/httpd/conf/ssl.key/server.key'),
 cert: fs1.readFileSync('/etc/httpd/conf/ssl.crt/alpha_kuwa_org.pem')
};

app.get('/', function (req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers', '*');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, PATCH, GET');
        return res.status(200).json({});
    }
    next();
});

app.post('/KuwaRegistration', function (req, res){
  console.log('e1');
  var form = new formidable.IncomingForm();

  // parsing the form POST request
  form.parse(req, function(err, fields, files) {

    console.log(files.ChallengeVideo.name);
    console.log(fields);

    var oldpath = files.ChallengeVideo.path;
    var newpath = '/registrations/' + fields.ClientAddress + '/ChallengeVideo.mp4';
    var newInfoFilePath = '/registrations/'+fields.ClientAddress+'/'+'info.json';

    // creating the new dir and copying the contents
    fs.createFile(newpath, function(err) {
              console.log(err); 
            });

    fs.copy(oldpath, newpath, function(err){
      if (err) return console.error(err);

      console.log("success!")
    }); 

    // creating info.json file and populating it with client address, contract address, contract ABI
    fs.outputJson(newInfoFilePath, fields, function(err) {
      console.log(err); 

      fs.readJson(newInfoFilePath, function(err, data) {
        console.log(data.ClientID); 
      })
    });

  });

  form.on('file', function (name, file){
    console.log('Uploaded challenge video successfully ' + file.name);
  });

  res.send('Video uploaded successfully');


});

//http.createServer(app).listen(port, function() {
//    console.log('Storage manager Server Started On Port %d', port);
//});

https.createServer(options, app).listen(port, function() {
    console.log('Storage manager Server Started On Port %d', port);
});

//app.listen(port, () => console.log(`Server listening on port ${port}`));


