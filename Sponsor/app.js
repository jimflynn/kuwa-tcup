const express = require('express');

const app = express();

const morgan = require("morgan");

const bodyParser = require('body-parser');

const formidable = require("formidable");

const getConfig = require("./api/routes/getConfig");

const sponsorship_requests_routes = require("./api/routes/sponsorship_requests");

const request_passcode = require("./api/routes/request_passcode");

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));

//app.use(bodyParser.json());

//app.use(formidable());
app.use(function (req, res, next) {
let form = new formidable.IncomingForm({
encoding: 'utf-8',
multiples: true,
keepExtensions: true
})
form.once('error', console.log)
form.parse(req, function (err, fields, files) {
Object.assign(req, {fields, files});
next();
})
})

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers', '*');
	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, PATCH, GET');
		return res.status(200).json({});
	}
	next();
})
app.use('/getConfig', getConfig);

app.use('/sponsorship_requests', sponsorship_requests_routes);

app.use('/request_passcode', request_passcode);

app.use((req, res, next) => {

	//res.send("Please use /sponsorship_requests for checking status");
	const error = new Error('Please use /sponsorship_requests for checking status');
	error.status = 400;
	next(error);

});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

//app.post('/sponsorship_requests, ')

module.exports = app;
