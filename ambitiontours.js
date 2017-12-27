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
var payment = require('./api/payment.js');


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
app.post('/api/airTicket', contact.airTicket);
app.post('/api/visaEnquiry', contact.visaEnquiry);
app.post('/api/booktour', contact.booktour);
app.post('/api/purchasevoucher', contact.purchasevoucher);

app.post('/api/tourPayment', payment.tourPayment);
app.post('/api/voucherPayment', payment.voucherPayment);

app.post('/api/apply', startup.apply);
app.post('/api/invest', investor.invest);

app.post('/api/adminlogin', admin.adminlogin);
app.get('/api/getAdminDetails/:id', admin.getAdminDetails);
app.post('/api/updatepassword', admin.updatepassword);
app.post('/api/updateContact', admin.updateContact);

app.post('/api/updateOpHours', admin.updateOpHours);
app.get('/api/getOpHoursDetails/:id', admin.getOpHoursDetails);

app.post('/api/addHoliday', admin.addHoliday);
app.get('/api/getHolidayDetails/:id', admin.getHolidayDetails);
app.post('/api/updateHoliday', admin.updateHoliday);
app.get('/api/deleteHoliday/:id', admin.deleteHoliday);

app.post('/api/addSocial', admin.addSocial);
app.get('/api/getSocialDetails/:id', admin.getSocialDetails);
app.post('/api/updateSocial', admin.updateSocial);
app.get('/api/deleteSocial/:id', admin.deleteSocial);

app.get('/api/getAdminContactDetails', admin.getAdminContactDetails);
app.get('/api/getOperatingHours', admin.getOperatingHours);
app.get('/api/getPublicHolidays', admin.getPublicHolidays);
app.get('/api/getSocial', admin.getSocial);

app.get('/api/getAllBookings', admin.getAllBookings);
app.get('/api/getAttractionBookings', admin.getAttractionBookings);
app.get('/api/getTourEnquiries', admin.getTourEnquiries);
app.get('/api/getCustomTourEnquiries', admin.getCustomTourEnquiries);
app.get('/api/getAirTicketEnquiries', admin.getAirTicketEnquiries);
app.get('/api/getVisaEnquiries', admin.getVisaEnquiries);
app.get('/api/getVoucherBookings', admin.getVoucherBookings);

app.get('/api/deleteAttractionBookings/:id', admin.deleteBookings);
app.get('/api/deleteTourEnquiries/:id', admin.deleteBookings);
app.get('/api/deleteCustomTourEnquiries/:id', admin.deleteCustomTourEnquiries);
app.get('/api/deleteAirTicketEnquiries/:id', admin.deleteAirTicketEnquiries);
app.get('/api/deleteVisaEnquiries/:id', admin.deleteVisaEnquiries);
app.get('/api/deleteVoucherBookings/:id', admin.deleteVoucherBookings);

app.get('/api/getTourBookingDetails/:id', admin.getTourBookingDetails);
app.get('/api/getCustomTourDetails/:id', admin.getCustomTourDetails);
app.get('/api/getAirTicketDetails/:id', admin.getAirTicketDetails);
app.get('/api/getVisaEnquiriesDetails/:id', admin.getVisaEnquiriesDetails);

app.get('/api/getAllTours', admin.getAllTours);
app.get('/api/getCountryTours/:id', admin.getCountryTours);
app.get('/api/getAllAttractions', admin.getAllAttractions);
app.get('/api/getCountryAttractions/:id', admin.getCountryAttractions);
app.get('/api/getTourDetails/:id', admin.getTourDetails);
app.post('/api/addTour', admin.addTour);
app.post('/api/updateTour', admin.updateTour);
app.get('/api/deleteTour/:id', admin.deleteTour);

app.get('/api/allcountries', admin.allcountries);
app.get('/api/getallcountries', admin.getallcountries);
app.get('/api/gettourcountries', admin.gettourcountries);
app.get('/api/getattractioncountries', admin.getattractioncountries);
app.get('/api/getCountryId/:id', admin.getCountryId);
app.get('/api/getCountryDetails/:id', admin.getCountryDetails);
app.post('/api/addCountry', admin.addCountry);
app.post('/api/updateCountry', admin.updateCountry);
app.get('/api/deleteCountry/:id', admin.deleteCountry);

app.get('/api/getAllVisaDetails', admin.getAllVisaDetails);
app.get('/api/getVisa',admin.getVisa);
app.get('/api/getVisaDetails/:id',admin.getVisaDetails);
app.post('/api/addVisa', admin.addVisa);
app.post('/api/updateVisa',admin.updateVisa);
app.get('/api/deleteVisa/:id',admin.deleteVisa);

app.get('/api/getAllGiftVouchers', admin.getAllGiftVouchers);
app.get('/api/getVoucherDetails/:id',admin.getVoucherDetails);
app.post('/api/addVoucher', admin.addVoucher);
app.post('/api/updateVoucher',admin.updateVoucher);
app.get('/api/deleteVoucher/:id',admin.deleteVoucher);
app.get('/api/getVoucherBookingDetails/:id', admin.getVoucherBookingDetails);


app.listen(6008, function () {
  console.log('CORS-enabled web server listening on port 6008')
})
console.log("Magic at http://localhost:6008");
