var connect = require('connect');
var express = require('express');
var url = require('url');
var app = express();
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var path = require('path');
var bodyParser = require( 'body-parser' );
var nodemailer = require( 'nodemailer' );
var cors = require('cors');
var http = require("http").createServer(app);
fs = require('fs-extra');

var contact = require('./api/contact.js');
var startup = require('./api/startup.js');
var investor = require('./api/investor.js');
var admin = require('./api/admin.js');

/*app.use(function(req, res, next){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	console.log(query);
	next();
});*/

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Credentials', false);
  next();
});

app.use(bodyParser.json({ limit: '50mb', extended: true, type:'application/json' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, type:'application/x-www-form-urlencoding' }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.raw({ limit: '50mb' }));

var www = connect();
www.use(serveStatic('www'));
app.use('/', www);

app.post('/api/consult', contact.consult);
app.post('/api/customTour', contact.customTour);

app.post('/api/apply', startup.apply);
app.post('/api/invest', investor.invest);

app.post('/api/adminlogin', admin.adminlogin);
app.post('/api/updatepassword', admin.updatepassword);
app.get('/api/allcountries', admin.allcountries);
app.get('/api/getallcountries', admin.getallcountries);
app.get('/api/getAllAttractions', admin.getAllAttractions);
app.get('/api/getAllTours', admin.getAllTours);
app.get('/api/getAllBookings', admin.getAllBookings);
app.get('/api/getCountryTours/:id', admin.getCountryTours);
app.get('/api/getCountryId/:id', admin.getCountryId);

app.get('/api/getTourDetails/:id', admin.getTourDetails);
app.post('/api/addTour', admin.addTour);
app.post('/api/updateTour', admin.updateTour);
app.get('/api/deleteTour/:id', admin.deleteTour);


app.get('/api/getCountryDetails/:id', admin.getCountryDetails);
app.post('/api/addCountry', admin.addCountry);
app.post('/api/updateCountry', admin.updateCountry);
app.get('/api/deleteCountry/:id', admin.deleteCountry);

app.get('/api/getAdminDetails/:id', admin.getAdminDetails);

app.listen(6008, function () {
  console.log('CORS-enabled web server listening on port 6008')
})
console.log("Magic at http://localhost:6008");
