const express = require('express');

const app = express();

const morgan = require("morgan");

const bodyParser = require('body-parser');

const sponsorship_requests_routes = require("./api/routes/sponsorship_requests");

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers', '*');
	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, PATCH, GET');
		return res.status(200).json({});
	}
	next();
})

app.use('/sponsorship_requests', sponsorship_requests_routes);

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