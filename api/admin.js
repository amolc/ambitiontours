var http = require('http');
var mysql = require('mysql');
var randomString = require('random-string');
var moment = require("moment");
var verifycode = randomString();
var now = moment();
var db = mysql.createPool({
  database: 'ambitiontours',
  user: 'root',
  password: '10gXWOqeaf',
  host: 'db.80startups.com',
});

var CRUD = require('mysql-crud');
var userCRUD = CRUD(db, 'tbl_Users');
var tourCRUD = CRUD(db, 'tbl_Tours');

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
        UserType : 'Admin'
    }, function (err, val) {


        if (val.length > 0) 
        {

                   userCRUD.load({
                        UserName: username,
                        UserType : 'Admin',
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

exports.updatepassword = function(req, res){

     dateToday = now.format("DD/MM/YYYY hh:mm a");
     var updateObj = {

              'Password': req.body.npassword,
              'ModifiedOn' : dateToday,

      };

    userCRUD.update({UserId: req.body.UserId}, updateObj,function(err, val) {

        if (!err) 
        {
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
    
};

exports.allcountries = function (req, res) {
    var sql = "SELECT `CountryId`,`CountryTitle`,`CountryImage` FROM `tbl_Countries` WHERE `IsDeleted` = '0'";
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.getAllTours = function(req, res){

  var sql = "SELECT t.*,c.`CountryId`,c.`CountryTitle` FROM `tbl_Tours` as t LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = t.`CountryId` WHERE t.`TourType` = 'Tour' AND t.`IsDeleted` = '0' ORDER BY t.`TourId` DESC";
    db.query(sql, function (err, data) {
        res.json(data);
    });
    
};

exports.getAllAttractions = function(req, res){

  var sql = "SELECT t.*,c.`CountryId`,c.`CountryTitle` FROM `tbl_Tours` as t LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = t.`CountryId` WHERE t.`TourType` = 'Attraction' AND t.`IsDeleted` = '0' ORDER BY t.`TourId` DESC";
    db.query(sql, function (err, data) {
        res.json(data);
    });
    
};

exports.getAllBookings = function(req, res){

  var sql = "SELECT b.* FROM `tbl_Bookings` as b ORDER BY b.`BookingId` DESC";
    db.query(sql, function (err, data) {
        res.json(data);
    });
    
};

exports.getTourDetails = function(req, res){

  var tourid = req.params.id;
  var sql = "SELECT t.*,c.`CountryId`,c.`CountryTitle` FROM `tbl_Tours` as t LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = t.CountryId WHERE TourId = "+tourid;
    db.query(sql, function (err, data) {
        res.json(data[0]);
    });
    
};

exports.addTour = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    date = now.format("DD/MM/YYYY");

     verifycode = randomString();
     if (req.body.image) {
         var imagedata = req.body.image;
         var matches = "";

         function decodeBase64Image(dataString) {
             var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                 response = {};
             if (matches.length !== 3) {
                 return new Error('Invalid input string');
             }
             response.type = matches[1];
             response.data = new Buffer(matches[2], 'base64');
             return response;
         }
         var decodedImg = decodeBase64Image(imagedata);
         var imageBuffer = decodedImg.data;
         var type = decodedImg.type;
         fileName = verifycode+'_'+req.body.TourImage;
         if (req.body.TourType == 'Tour')
          fs.writeFileSync('www/uploads/tours/' + fileName, imageBuffer, 'utf8');
         if (req.body.TourType == 'Attraction')
          fs.writeFileSync('www/uploads/attractions/' + fileName, imageBuffer, 'utf8');

     }else {
         fileName = '';
         console.log("image not present");
     }
        
    var createObj = {
                                "CountryId" :  req.body.CountryId,
                                "TourType": req.body.TourType || "",
                                "TourTitle" : req.body.TourTitle,
                                "TourDescription":req.body.TourDescription,
                                "TourLocation": req.body.TourLocation || "",
                                "TourDuration": req.body.TourDuration || "",
                                "TourImage": fileName || "", 
                                "TourCost": req.body.TourCost || "", 
                                "CreatedOn": dateToday || "",        
                            };
                            // console.log("after", createObj);

                            tourCRUD.create(createObj, function (err, data) {

                                if (!err) 
                                {
                                    var resdata = {
                                        status: true,
                                        value:data.insertId,
                                        message: 'Details successfully added',
                                        date : dateToday
                                    };

                                    res.jsonp(resdata);
                                }
                                else
                                {
                                    var resdata = {
                                        status: false,
                                        error: err,
                                        message: 'Error: Details not successfully added. '
                                    };

                                    res.jsonp(resdata);
                                }
                            });
};


exports.updateTour = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    date = now.format("DD/MM/YYYY");

     verifycode = randomString();
     if (req.body.image) {
         var imagedata = req.body.image;
         var matches = "";

         function decodeBase64Image(dataString) {
             var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                 response = {};
             if (matches.length !== 3) {
                 return new Error('Invalid input string');
             }
             response.type = matches[1];
             response.data = new Buffer(matches[2], 'base64');
             return response;
         }
         var decodedImg = decodeBase64Image(imagedata);
         var imageBuffer = decodedImg.data;
         var type = decodedImg.type;
         fileName = verifycode+'_'+req.body.TourImage;
         if (req.body.TourType == 'Tour')
          fs.writeFileSync('www/uploads/tours/' + fileName, imageBuffer, 'utf8');
        if (req.body.TourType == 'Attraction')
          fs.writeFileSync('www/uploads/attractions/' + fileName, imageBuffer, 'utf8');
     }else {
         fileName = req.body.TourImage;
         console.log("image not present");
     }
        
    var updateObj = {
                                "CountryId" :  req.body.CountryId,
                                "TourType": req.body.TourType || "",
                                "TourTitle" : req.body.TourTitle,
                                "TourDescription":req.body.TourDescription,
                                "TourLocation": req.body.TourLocation || "",
                                "TourDuration": req.body.TourDuration || "",
                                "TourImage": fileName || "", 
                                "TourCost": req.body.TourCost || "", 
                                "ModifiedOn": dateToday || "",        
                            };
                            // console.log("after", createObj);

                            tourCRUD.update({TourId: req.body.TourId}, updateObj,function (err, data) {

                                if (!err) 
                                {
                                    var resdata = {
                                        status: true,
                                        value:data.insertId,
                                        message: 'Details successfully updated',
                                        date : dateToday
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
};



exports.deleteTour = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var tourid = req.params.id;
    var updateObj = {
                         "IsDeleted" :  '1',
      
                    };
                            // console.log("after", createObj);

                            tourCRUD.update({TourId: tourid}, updateObj,function (err, data) {

                                if (!err) 
                                {
                                    var resdata = {
                                        status: true,
                                        value:data.insertId,
                                        message: 'Details successfully deleted',
                                        date : dateToday
                                    };

                                    res.jsonp(resdata);
                                }
                                else
                                {
                                    var resdata = {
                                        status: false,
                                        error: err,
                                        message: 'Error: Details not successfully deleted. '
                                    };

                                    res.jsonp(resdata);
                                }
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