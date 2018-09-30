const http = require("http");

const https = require('https');

const app = require("./app");

const fs = require("fs");

const port = process.env.PORT || 3002;

var options = {
 key: fs.readFileSync('/etc/httpd/conf/ssl.key/server.key'),
 cert: fs.readFileSync('/etc/httpd/conf/ssl.crt/alpha_kuwa_org.pem')
};

const server = http.createServer(app);

server.listen(port, '0.0.0.0');

console.log("Sponsor Server listening on PORT " + port);


https.createServer(options, app).listen(3000);

console.log("Server listening")

