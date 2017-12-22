var http = require('http');
var mysql = require('mysql');
var stripe = require("stripe")("sk_test_guEUC69eipC2OWffsxuKD3JY"); 
var moment = require("moment");
var now = moment();
var db = mysql.createPool({
  database: 'ambitiontours',
  user: 'root',
  password: '10gXWOqeaf',
  host: 'db.80startups.com',
});

var CRUD = require('mysql-crud');
var bookCRUD = CRUD(db,'tbl_Bookings');
var vbookCRUD = CRUD(db,'tbl_VoucherBooking');

var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var transporter = nodemailer.createTransport({
  host: 'in-v3.mailjet.com',
  port: '587',
  auth: {
    user: '66ca4479851e0bd9cedc629bdff36ee6',
    pass: 'a3ec60f55a89f7fab98891e86818c8db'
  }
});


exports.tourPayment = function(req, res){
        //console.log(req.body);
        var token = req.body.stripeToken;
        var amount = req.body.TotalAmount ;
        var stripeToken = "" ;
        // Charge the user's card:
        var charge = stripe.charges.create({
          amount: amount,
          currency: "sgd",
          description: req.body.TourTitle,
          source: token
        }, function(err, charge) {
          // asynchronously called
        //  console.log('err',err);
          if(!err){
              //  console.log('charge',charge);
                stripetoken = charge.id ;

                 dateToday = now.format("DD/MM/YYYY hh:mm a");
                 var updateObj = {

                          'stripetoken': stripetoken,
                          'PaymentStatus' : 'Paid',
                          'PaymentDate' : dateToday
                  };

                bookCRUD.update({BookingId: req.body.BookingId}, updateObj,function(err, val) {

                    if (!err) 
                    {

                            var customerEmail = req.body.email+',sadiarahman1@yahoo.com,nadyshaikh@gmail.com,ceo@80startups.com,office@80startups.com ,shital.talole@fountaintechies.com,komal.gaikwad@fountaintechies.com';
                            var recipientEmail = 'sadia@ambitiontours.com,sadiarahman1@yahoo.com,nadyshaikh@gmail.com,ceo@80startups.com,office@80startups.com ,shital.talole@fountaintechies.com,komal.gaikwad@fountaintechies.com';
                            //var customerEmail = req.body.email; //,ceo@80startups.com,shital.talole@fountaintechies.com'; //,ceo@80startups.com,shital.talole@80startups.com
                            //r recipientEmail = 'komal.gaikwad@fountaintechies.com';
                            var subject = "New Attraction Booking";
                            var customersubject  = "Thank You for your Booking!";
                            var mailbody = '<table>\
                                      <tr>\
                                      <td><img src="https://ambitiontours.80startups.com/assets/img/logo.png"></td><br>\
                                    </tr>\
                                    <tr>\
                                      <td><h1>Dear Ambition Tours,</td>\
                                    </tr>\
                                    <tr>\
                                    </tr>\
                                    <tr>\
                                      <td>Booking Details:</td>\
                                    </tr>\
                                    <tr>\
                                      <td><br><br><strong> Name:  ' + req.body.fullName + '</strong><br><br><strong> Email:   ' + req.body.email + '</strong><br><br><strong> Contact Number:   ' + req.body.phoneNumber + '</strong><br><br><strong> Package Name:   ' + req.body.TourTitle + '</strong><br><br><strong> Price For Adult : SGD  ' + req.body.TourCost + '</strong><br><br><strong> Price For Child : SGD  ' + req.body.ChildCost + '</strong><br><br><strong> No of Adults:   ' + req.body.adults + '</strong><br><br><strong> No of Child:   ' + req.body.Child + '</strong><br><br><strong> Travel Date:   ' +  req.body.travelDate.substring(0,10) + '</strong><br><br><strong>Message:   ' + req.body.message + '</strong><br><br><strong> Total Amount:   SGD ' + req.body.TotalAmount + '</strong><br><br><strong> Stripe Token:   '+stripetoken+'</strong><br><br><strong> Payment Status:   Paid</strong><br><br></td>\
                                    </tr>\
                                    <tr>\
                                      <td>Best wishes,</td>\
                                    </tr>\
                                    <tr>\
                                      <td><h2>ambitiontours.com</h2></td>\
                                    </tr>\
                                    <tr>\
                                      <td bgcolor="#000000"><font color ="white">This is a one-time email. Please do not reply to this email.</font></td>\
                                    </tr>\
                                  </table>';


                          var customermailbody = '<table>\
                                      <tr>\
                                      <td><img src="https://ambitiontours.80startups.com/assets/img/logo.png"></td><br>\
                                    </tr>\
                                    <tr>\
                                      <td><h1>Dear '+req.body.fullName+',</td>\
                                    </tr>\
                                    <tr>\
                                    </tr>\
                                    <tr>\
                                      <td>Booking Details:</td>\
                                    </tr>\
                                    <tr>\
                                      <td><br><br><strong> Name:  ' + req.body.fullName + '</strong><br><br><strong> Email:   ' + req.body.email + '</strong><br><br><strong> Contact Number:   ' + req.body.phoneNumber + '</strong><br><br><strong> Package Name:   ' + req.body.TourTitle + '</strong><br><br><strong> Price For Adult : SGD  ' + req.body.TourCost + '</strong><br><br><strong> Price For Child : SGD  ' + req.body.ChildCost + '</strong><br><br><strong> No of Adults:   ' + req.body.adults + '</strong><br><br><strong> No of Child:   ' + req.body.Child + '</strong><br><br><strong> Travel Date:   ' +  req.body.travelDate.substring(0,10) + '</strong><br><br><strong>Message:   ' + req.body.message + '</strong><br><br><strong> Total Amount:   SGD ' + req.body.TotalAmount + '</strong><br><br><strong> Stripe Token:   '+stripetoken+'</strong><br><br><strong> Payment Status:   Paid</strong><br><br></td>\
                                    </tr>\
                                    <tr>\
                                      <td>Best wishes,</td>\
                                    </tr>\
                                    <tr>\
                                      <td><h2>ambitiontours.com</h2></td>\
                                    </tr>\
                                    <tr>\
                                      <td bgcolor="#000000"><font color ="white">This is a one-time email. Please do not reply to this email.</font></td>\
                                    </tr>\
                                  </table>';

                        send_mail(recipientEmail, subject, mailbody);
                        send_mail(customerEmail, customersubject, customermailbody);

                        var resdata = {
                            status: true,
                            value:val,
                            message: 'Details successfully updated'
                        };

                        res.jsonp(resdata);
                    }
                    else
                    {
                        var resdata = {
                            status: false,
                            error: err,
                            message: 'Error: Details not successfully updated. '
                        };

                        res.jsonp(resdata);
                    }

                });
                            

                      }


          else{
                  console.log('err',err);
                }

        });


        // Send an email
};


exports.voucherPayment = function(req, res){
        //console.log(req.body);
        var token = req.body.stripeToken;
        var amount = req.body.TotalAmount ;
        var stripeToken = "" ;
        // Charge the user's card:
        var charge = stripe.charges.create({
          amount: amount,
          currency: "sgd",
          description: req.body.Code,
          source: token
        }, function(err, charge) {
          // asynchronously called
        //  console.log('err',err);
          if(!err){
              //  console.log('charge',charge);
                stripetoken = charge.id ;

                 dateToday = now.format("DD/MM/YYYY hh:mm a");
                 var updateObj = {

                          'stripeToken': stripetoken,
                          'PaymentStatus' : 'Paid',
                          'PaymentDate' : dateToday
                  };

                vbookCRUD.update({VBookId: req.body.VBookId}, updateObj,function(err, val) {

                    if (!err) 
                    {

                          var customerEmail = req.body.Email+',sadiarahman1@yahoo.com,nadyshaikh@gmail.com,ceo@80startups.com,office@80startups.com ,shital.talole@fountaintechies.com,komal.gaikwad@fountaintechies.com';
                          var recipientEmail = 'sadia@ambitiontours.com,sadiarahman1@yahoo.com,nadyshaikh@gmail.com,ceo@80startups.com,office@80startups.com ,shital.talole@fountaintechies.com,komal.gaikwad@fountaintechies.com';
                          //var customerEmail = req.body.Email; //,ceo@80startups.com,shital.talole@fountaintechies.com'; //,ceo@80startups.com,shital.talole@80startups.com
                          //var recipientEmail = 'komal.gaikwad@fountaintechies.com';
                          var subject = "New Order Of Travel Gift Vouchers";
                          var customersubject  = "Thank You for Buying Travel Gift Voucher!";

                          var mailbody = '<table>\
                                      <tr>\
                                      <td><img src="https://ambitiontours.80startups.com/assets/img/logo.png"></td><br>\
                                    </tr>\
                                    <tr>\
                                      <td><h1>Dear Ambition Tours,</td>\
                                    </tr>\
                                    <tr>\
                                    </tr>\
                                    <tr>\
                                      <td>Gift Voucher Purchase Details:</td>\
                                    </tr>\
                                    <tr>\
                                      <td><br><br><strong> Name:   ' + req.body.Name + '</strong><br><br><strong> Email: ' + req.body.Email + '</strong>  <br><br><strong> Contact No:  ' + req.body.Contact + '</strong><br><br><strong> Address:   ' + req.body.Address + '</strong><br><br><strong> Request:   ' + req.body.Request + '</strong><br><br><strong> Voucher Code:   ' + req.body.Code + '</strong><br><br><strong> Price:   ' + req.body.Price + '</strong><br><br><strong> Quantity:   ' +  req.body.Quantity + '</strong><br><br><strong>Total Amount:   SGD ' + req.body.TotalAmount + '</strong><br><br><strong> stripeToken:   ' + stripetoken + '</strong><br><br><strong> Payment Status:   Paid</strong><br><br></td>\
                                    </tr>\
                                    <tr>\
                                      <td>Best wishes,</td>\
                                    </tr>\
                                    <tr>\
                                      <td><h2>ambitiontours.com</h2></td>\
                                    </tr>\
                                    <tr>\
                                      <td bgcolor="#000000"><font color ="white">This is a one-time email. Please do not reply to this email.</font></td>\
                                    </tr>\
                                  </table>';

                        var customermailbody = '<table>\
                                      <tr>\
                                      <td><img src="https://ambitiontours.80startups.com/assets/img/logo.png"></td><br>\
                                    </tr>\
                                    <tr>\
                                      <td><h1>Dear '+req.body.Name+',</td>\
                                    </tr>\
                                    <tr>\
                                    </tr>\
                                    <tr>\
                                      <td>Gift Voucher Purchase Details:</td>\
                                    </tr>\
                                    <tr>\
                                      <td><br><br><strong> Name:   ' + req.body.Name + '</strong><br><br><strong> Email: ' + req.body.Email + '</strong>  <br><br><strong> Contact No:  ' + req.body.Contact + '</strong><br><br><strong> Address:   ' + req.body.Address + '</strong><br><br><strong> Request:   ' + req.body.Request + '</strong><br><br><strong> Voucher Code:   ' + req.body.Code + '</strong><br><br><strong> Price:   ' + req.body.Price + '</strong><br><br><strong> Quantity:   ' +  req.body.Quantity + '</strong><br><br><strong>Total Amount:  SGD ' + req.body.TotalAmount + '</strong><br><br><strong> stripeToken:   ' + stripetoken + '</strong><br><br><strong> Payment Status:   Paid</strong><br><br></td>\
                                    </tr>\
                                    <tr>\
                                      <td>Best wishes,</td>\
                                    </tr>\
                                    <tr>\
                                      <td><h2>ambitiontours.com</h2></td>\
                                    </tr>\
                                    <tr>\
                                      <td bgcolor="#000000"><font color ="white">This is a one-time email. Please do not reply to this email.</font></td>\
                                    </tr>\
                                  </table>';

                        send_mail(recipientEmail, subject, mailbody);
                        send_mail(customerEmail, customersubject, customermailbody);

                        var resdata = {
                            status: true,
                            value:val,
                            message: 'Details successfully updated'
                        };

                        res.jsonp(resdata);
                    }
                    else
                    {
                        var resdata = {
                            status: false,
                            error: err,
                            message: 'Error: Details not successfully updated. '
                        };

                        res.jsonp(resdata);
                    }

                });
                            

                      }


          else{
                  console.log('err',err);
                }

        });


        // Send an email
};

function send_mail(usermail, subject, mailbody) {

  var auth = {
    auth: {
      api_key: 'key-b4687b67307cb2598abad76006bd7a4a',
      domain: '80startups.com'
    }
  }

  var nodemailerMailgun = nodemailer.createTransport(mg(auth));

  nodemailerMailgun.sendMail({
    from: 'sadia@ambitiontours.com',
    to: usermail, // An array if you have multiple recipients.
    subject: subject,
    'h:Reply-To': 'operations@80startups.com',
    //You can use "html:" to send HTML email content. It's magic!
    html: mailbody,
    //You can use "text:" to send plain-text content. It's oldschool!
    text: mailbody
  }, function (err, info) {
    if (err) {
      console.log('Error: ' + err);
    } else {
      console.log('Response: ' + info);
      //res.sendStatus(200);

    }
  });
};