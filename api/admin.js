var http = require('http');
var mysql = require('mysql');
var db = mysql.createPool({
  database: 'ambitiontours',
  user: 'root',
  password: '10gXWOqeaf',
  host: 'db.80startups.com',
});

var CRUD = require('mysql-crud');
var userCRUD = CRUD(db, 'tbl_Users');

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

////-----------------APPLY-----------------

exports.adminlogin = function (req, res) {

    // console.log('req.body',req.body);

    var username = req.body.username;
    var password = req.body.password;


    userCRUD.load({
        UserName: username,
        Type : 'Admin'
    }, function (err, val) {


        if (val.length > 0) 
        {

            userCRUD.load({
                UserName: username,
                Type : 'Admin'
                VerificationCode: null
            },function (err3, val3) {

                if (val3.length > 0) 
                {

                   userCRUD.load({
                        UserName: username,
                        Type : 'Admin'
                        VerificationCode: null,
                        Password: password,
                    },function (err2, val2) {

                        if (val2.length > 0) 
                        {

                            var resdata2 = {
                                passValid: true,
                                value:val2[0],
                                message: 'successfully login welcome to admin panel.'
                            };

                            res.jsonp(resdata2);

                        }
                        else
                        {

                            var resdata2 = {
                                passValid: false,
                                error: err2,
                                message: 'Password is incorrect!'
                            };

                            res.jsonp(resdata2);

                        }


                    });

                }
                else
                {

                    var resdata3 = {
                        verifyValid: false,
                        error: err3,
                        message: 'Please confirm your email!'
                    };

                    res.jsonp(resdata3);

                }


            });

        } 
        else 
        {
            var resdata = {
                emailexist: false,
                error: err,
                message: 'Username does not exist!'
            };

            res.jsonp(resdata);
        }

       // res.jsonp(resdata);

    });
};
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
  }, function (err, info) {
    if (err) {
      console.log('Error: ' + err);
    } else {
      console.log('Response: ' + info);
      //res.sendStatus(200);

    }
  });
};