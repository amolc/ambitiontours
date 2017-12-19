var http = require('http');
var mysql = require('mysql');
var db = mysql.createPool({
  database: 'ambitiontours',
  user: 'root',
  password: '10gXWOqeaf',
  host: 'db.80startups.com',
});

var CRUD = require('mysql-crud');
var consultCRUD = CRUD(db, 'contact');
var ctourCRUD = CRUD(db, 'tbl_CustomTours');
var ticketCRUD = CRUD(db,'tbl_AirTickets')

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

////-----------------CONTACT-----------------

exports.consult = function (req, res) {
console.log(req.body);
  var fullName = req.body.fullname;
  var email = req.body.email;
  var phoneNumber = req.body.phonenumber;
  var travelDate = req.body.travelDate;


   // var travleDate = $scope.travelDate;
    var tdate = travelDate.split("T");
    console.log(tdate);
    var travelDate = tdate[0];
  var message = req.body.message;
   var packageName = req.body.packageName;
  var packagePrice = req.body.packagePrice;
  var adults = req.body.adults;
  var Child = req.body.Child;
  var promoCode = req.body.promoCode;


  consultCRUD.create({
			'fullName': fullName,
      'email': email,
      'phonenumber': phoneNumber,
      'travelDate': travelDate,
      'packageName': packageName,
      'adults': adults,
      'Child': Child,
      'promoCode': promoCode,
      'message': message,
		},function (err,vals){

    })
     var recipientEmail = 'sadiarahman1@yahoo.com,nadyshaikh@gmail.com,ceo@80startups.com,office@80startups.com ,shital.talole@fountaintechies.com,pravinshelar999@gmail.com';
    //var recipientEmail = 'pravinshelar999@gmail.com'; //,ceo@80startups.com,shital.talole@fountaintechies.com'; //,ceo@80startups.com,shital.talole@80startups.com
    var subject = "[ambitiontours.COM] Ambition Tours Booking";
    var mailbody = '<table>\
                        <tr>\
                        <td><img src="https://ambitiontours.80startups.com/assets/img/logo.jpg"></td><br>\
                      </tr>\
                      <tr>\
                        <td><h1>Dear Ambition Tours,</td>\
                      </tr>\
                      <tr>\
                      </tr>\
                      <tr>\
                        <td>You have one enquiry from the following client:</td>\
                      </tr>\
                      <tr>\
                        <td>The details are as follow :<br><br><strong> Package Name:   ' + packageName + '</strong><br><br><strong> Package Price: SGD  ' + packagePrice + '</strong>  <br><br><strong> Name:   ' + fullName + '</strong><br><br><strong> Email:   ' + email + '</strong><br><br><strong> Contact Number:   ' + phoneNumber + '</strong><br><br><strong> No of Adults:   ' + adults + '</strong><br><br><strong> No of Child:   ' + Child + '</strong><br><br><strong> Travel Date:   ' + travelDate + '</strong><br><br><strong>Message:   ' + message + '</strong><br><br><strong> Promo Code:   ' + promoCode + '</strong><br><br></td>\
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
}


exports.customTour = function (req, res) {
//console.log(req.body);
  var fullName = req.body.fullname;
  var email = req.body.email;
  var phoneNumber = req.body.phonenumber;
  var travelDate = req.body.travelDate;


   // var travleDate = $scope.travelDate;
    var tdate = travelDate.split("T");
    //console.log(tdate);
    var travelDate = tdate[0];
  var message = req.body.message;
  /* var packageName = req.body.packageName;
  var packagePrice = req.body.packagePrice;
  var adults = req.body.adults;
  var Child = req.body.Child;
  var promoCode = req.body.promoCode;*/


  ctourCRUD.create({
      'FullName': fullName,
      'EmailId': email,
      'PhoneNumber': phoneNumber,
      'TravelDate': travelDate,
      'Message': message,
    },function (err,val){

      if (!err) 
        {

            // var recipientEmail = 'sadiarahman1@yahoo.com,nadyshaikh@gmail.com,ceo@80startups.com,shital.talole@fountaintechies.com,office@80startups.com';
          var recipientEmail = 'komal.gaikwad@fountaintechies.com'; //,ceo@80startups.com,shital.talole@fountaintechies.com'; //,ceo@80startups.com,shital.talole@80startups.com
          var subject = "[ambitiontours.COM] Ambition Tours Custom Tour Enquiry";
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
                              <td>You have one enquiry from the following client:</td>\
                            </tr>\
                            <tr>\
                              <td>The details are as follow :  <br><br><strong> Name:   ' + fullName + '</strong><br><br><strong> Email:   ' + email + '</strong><br><br><strong> Contact Number:   ' + phoneNumber + '</strong><br><br><strong> Travel Date:   ' + travelDate + '</strong><br><br><strong>Message:   ' + message + '</strong><br><br></td>\
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

        console.log(mailbody);

            send_mail(recipientEmail, subject, mailbody);


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

    })
    
}


exports.airTicket = function (req, res) {



  ticketCRUD.create({
      'Name': req.body.fullname,
      'Contact': req.body.phonenumber,
      'Email': req.body.email,
      'Destination': req.body.destination,
      'Airline': req.body.airline,
      'Type': req.body.type,
    },function (err,val){

      if (!err) 
        {

             //var recipientEmail = 'sadiarahman1@yahoo.com,nadyshaikh@gmail.com,ceo@80startups.com,shital.talole@fountaintechies.com,office@80startups.com';
              var recipientEmail = 'komal.gaikwad@fountaintechies.com'; //,ceo@80startups.com,shital.talole@fountaintechies.com'; //,ceo@80startups.com,shital.talole@80startups.com
              var subject = "[ambitiontours.COM] Ambition Tours Air Ticket Enquiry";
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
                                  <td>You have one enquiry from the following client:</td>\
                                </tr>\
                                <tr>\
                                  <td>The details are as follow :  <br><br><strong> Name:   ' + req.body.fullname + '</strong><br><br><strong> Email:   ' + req.body.email + '</strong><br><br><strong> Contact Number:   ' + req.body.phonenumber + '</strong><br><br><strong> Choice Of Destination:   ' + req.body.destination + '</strong><br><br><strong>Choice Of Airline:   ' + req.body.airline + '</strong><br><br><strong>Trip Type :   ' + req.body.type + '</strong><br><br></td>\
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

    })
    
}


///____________________END______________________

function send_mail(usermail, subject, mailbody) {

  var auth = {
    auth: {
      api_key: 'key-b4687b67307cb2598abad76006bd7a4a',
      domain: '80startups.com'
    }
  }

  var nodemailerMailgun = nodemailer.createTransport(mg(auth));

  nodemailerMailgun.sendMail({
    from: 'operations@80startups.com',
    to: usermail, // An array if you have multiple recipients.
    subject: subject,
    'h:Reply-To': 'operations@80startups.com',
    //You can use "html:" to send HTML email content. It's magic!
    html: mailbody,
    //You can use "text:" to send plain-text content. It's oldschool!
    text: mailbody
  }, function(err, info) {
    if (err) {
      console.log('Error: ' + err);
    } else {
      console.log('Response: ' + info);
      //res.sendStatus(200);

    }
  });
};
