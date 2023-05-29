require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express');
const jwt = require("jsonwebtoken");
const cors = require('cors');
const swaggerDocument = require('./docs/swagger.json');
const ErrorResponse = require('./utils/errorResponse');
const errorHandler = require('./utils/errorHandler');
const authorize = require('./middleware/authorize');
const { NODE_ENV } = process.env;

const app = express();

process.env.TZ = 'Asia/Kolkata';

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
let db = process.env.MONGO_CONNECTION_STRING || 'your mongo url'
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('connected to database');
	})
	.catch(() => {
		console.log('Mongodb connection error');
	});
mongoose.set('useCreateIndex', true);

// enable cors

app.use(cors());
app.options('*', cors());
app.use(cors({
	origin: '*',
	methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
	allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		'Access-Control-Allow-Headers : "Origin, X-Requested-With, Content-Type, Accept'
	);
	res.header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "*")
	next();
});

app.use(express.json());




// swagger docs
app.use(`/api/v1/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// middleware
app.use(authorize);

//api routes
app.use('/api/v1/user', require('./route/user'));
app.use('/api/v1/question', require('./route/question'));
app.use('/api/v1/survey', require('./route/survey'));





// send back a 404 error for any unknown api request
app.all('*', (req, res, next) => {
	next(new ErrorResponse(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
	errorHandler(err, req, res, next);
});

// handle error
app.use(errorHandler);


const port = process.env.PORT || 3000;


app.listen(port, () =>
	console.log(`server in running on PORT: ${port} - ENV: ${NODE_ENV}`)
);
