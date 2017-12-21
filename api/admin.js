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
var countriesCRUD = CRUD(db, 'tbl_Countries');
var visaCRUD = CRUD(db, 'tbl_VisaDetails');
var voucherCRUD = CRUD(db, 'tbl_GiftVoucher');
var opHourCRUD = CRUD(db, 'tbl_OperatingHours');
var holidaysCRUD = CRUD(db, 'tbl_PublicHolidays');


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

exports.getallcountries = function (req, res) {
    var sql = "SELECT `CountryId`,`CountryTitle`,`CountryImage` FROM `tbl_Countries` WHERE `IsDeleted` = '0' AND `CountryTitle`!='Singapore'";
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.getCountryId = function(req, res){

  var country = req.params.id;
  var sql = "SELECT `CountryId`,`CountryImage` FROM `tbl_Countries` WHERE CountryTitle = '"+country+"'";
    db.query(sql, function (err, data) {
        res.json(data[0]);
    });
    
};

exports.getCountryDetails = function(req, res){

  var id = req.params.id;
  var sql = "SELECT `CountryTitle`,`CountryImage` FROM `tbl_Countries` WHERE CountryId = '"+id+"'";    
  db.query(sql, function (err, data) {
        res.json(data[0]);
    });
    
};

exports.getAllTours = function(req, res){

  var sql = "SELECT t.*,c.`CountryId`,c.`CountryTitle` FROM `tbl_Tours` as t LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = t.`CountryId` WHERE t.`TourType` = 'Tour' AND t.`IsDeleted` = '0' ORDER BY t.`TourId` DESC";
    db.query(sql, function (err, data) {
        res.json(data);
    });
    
};

exports.getCountryTours = function(req, res){

  var CountryId = req.params.id;
  var sql = "SELECT t.*,c.`CountryId`,c.`CountryTitle` FROM `tbl_Tours` as t LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = t.`CountryId` WHERE t.`TourType` = 'Tour' AND t.`IsDeleted` = '0' AND t.`CountryId` = "+CountryId+" ORDER BY t.`TourId` DESC";
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

exports.getCountryAttractions = function(req, res){

  var CountryId = req.params.id;
  var sql = "SELECT t.*,c.`CountryId`,c.`CountryTitle` FROM `tbl_Tours` as t LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = t.`CountryId` WHERE t.`TourType` = 'Attraction' AND t.`IsDeleted` = '0' AND t.`CountryId` = "+CountryId+" ORDER BY t.`TourId` DESC";
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

exports.getAdminDetails = function(req, res){

  var userid = req.params.id;
  var sql = "SELECT `Password` FROM `tbl_Users` WHERE UserId = "+userid;
    db.query(sql, function (err, data) {
        res.json(data[0]);
    });
    
};

exports.getAdminContactDetails = function(req, res){ 

  var sql = "SELECT `UserId`,`Email`,`Address`,`ContactNo`,`Fax` FROM `tbl_Users` WHERE `UserType`='Admin' AND `IsDeleted` = '0'";
    db.query(sql, function (err, data) {
        res.json(data[0]);
    });
    
};

exports.getOperatingHours= function(req, res){ 

  var sql = "SELECT `Id`,`Days`,`FromTime`,`ToTime` FROM `tbl_OperatingHours` WHERE `IsDeleted` = '0'";
    db.query(sql, function (err, data) {
        res.json(data);
    });
    
};

exports.getOpHoursDetails = function(req, res){

  var id = req.params.id;
  var sql = "SELECT `Id`,`Days`,`FromTime`,`ToTime` FROM `tbl_OperatingHours` WHERE Id = '"+id+"'";    
  db.query(sql, function (err, data) {
        res.json(data[0]);
    });
    
};

exports.getPublicHolidays = function(req, res){ 

  var sql = "SELECT `Id`,`Title`,`Description` FROM `tbl_PublicHolidays` WHERE `IsDeleted` = '0'";
    db.query(sql, function (err, data) {
        res.json(data);
    });
    
};

exports.getHolidayDetails = function(req, res){

  var id = req.params.id;
  var sql = "SELECT `Id`,`Title`,`Description` FROM `tbl_PublicHolidays` WHERE Id = '"+id+"'";    
  db.query(sql, function (err, data) {
        res.json(data[0]);
    });
    
};


exports.getAllVisaDetails = function(req, res){

  var sql = "SELECT `Id`,`Country`,`VisaCharge`,`WorkingDays` FROM `tbl_VisaDetails` WHERE `IsDeleted`='0'";    
  db.query(sql, function (err, data) {
        res.json(data);
    });
    
};

exports.getVisa = function(req, res){
    
  var sql = "SELECT `Id`,`Country`,`VisaCharge`,`WorkingDays` FROM `tbl_VisaDetails` WHERE `IsDeleted`='0' LIMIT 1";    
  db.query(sql, function (err, data) {
        res.json(data[0]);
    });
    
};

exports.getVisaDetails = function(req, res){

  var id = req.params.id;
  var sql = "SELECT `Id`,`Country`,`VisaCharge`,`WorkingDays` FROM `tbl_VisaDetails` WHERE Id = '"+id+"'";    
  db.query(sql, function (err, data) {
        res.json(data[0]);
    });
    
};


exports.getAllGiftVouchers = function(req, res){

  var sql = "SELECT `Id`,`Code`,`Price` FROM `tbl_GiftVoucher` WHERE `IsDeleted`='0'";    
  db.query(sql, function (err, data) {
        res.json(data);
    });
    
};

exports.getVoucherDetails = function(req, res){

  var id = req.params.id;
  var sql = "SELECT `Id`,`Code`,`Price` FROM `tbl_GiftVoucher` WHERE Id = '"+id+"'";    
  db.query(sql, function (err, data) {
        res.json(data[0]);
    });
    
};



exports.addCountry = function (req, res) {

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
         fs.writeFileSync('www/uploads/countries/' + fileName, imageBuffer, 'utf8');

     }else {
         fileName = '';
         console.log("image not present");
     }
        
    var createObj = {
                                "CountryTitle" : req.body.CountryTitle,
                                "CountryImage": fileName || "", 
                                "CreatedOn": dateToday || "",        
                            };
                            // console.log("after", createObj);

                            countriesCRUD.create(createObj, function (err, data) {

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

exports.updateCountry = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    date = now.format("DD/MM/YYYY");
    // console.log(req.body.TourImage);

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
         fs.writeFileSync('www/uploads/countries/' + fileName, imageBuffer, 'utf8');
     }else {
         fileName = req.body.CountryImage;
         console.log("image not present");
     }
        
    var updateObj = {
                                "CountryTitle" : req.body.CountryTitle,
                                "CountryImage": fileName || "", 
                                "ModifiedOn": dateToday || "",        
                            };
                            // console.log("after", createObj);

                            countriesCRUD.update({CountryId: req.body.CountryId}, updateObj,function (err, data) {

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



exports.deleteCountry = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var id = req.params.id;
    var updateObj = {
                         "IsDeleted" :  '1',
      
                    };
                            // console.log("after", createObj);

                            countriesCRUD.update({CountryId: id}, updateObj,function (err, data) {

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

exports.addVisa= function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
        
    var createObj = {
                                "Country" : req.body.Country,
                                "VisaCharge": req.body.VisaCharge,
                                "WorkingDays": req.body.WorkingDays,
                                "CreatedOn": dateToday || "",        
                            };
                            // console.log("after", createObj);

                            visaCRUD.create(createObj, function (err, data) {

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

exports.updateVisa = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var updateObj = {
                                "Country" : req.body.Country,
                                "VisaCharge": req.body.VisaCharge,
                                "WorkingDays": req.body.WorkingDays,
                                "ModifiedOn": dateToday || "",        
                            };
                            // console.log("after", createObj);

                            visaCRUD.update({Id: req.body.Id}, updateObj,function (err, data) {

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



exports.deleteVisa = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var id = req.params.id;
    var updateObj = {
                         "IsDeleted" :  '1',
      
                    };
                            // console.log("after", createObj);

                            visaCRUD.update({Id: id}, updateObj,function (err, data) {

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

exports.addVoucher= function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
        
    var createObj = {
                                "Code" : req.body.Code,
                                "Price": req.body.Price,
                                "CreatedOn": dateToday || "",        
                            };
                            // console.log("after", createObj);

                            voucherCRUD.create(createObj, function (err, data) {

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

exports.updateVoucher = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var updateObj = {
                                "Code" : req.body.Code,
                                "Price": req.body.Price,
                                "ModifiedOn": dateToday || "",        
                            };
                            // console.log("after", createObj);

                            voucherCRUD.update({Id: req.body.Id}, updateObj,function (err, data) {

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



exports.deleteVoucher = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var id = req.params.id;
    var updateObj = {
                         "IsDeleted" :  '1',
      
                    };
                            // console.log("after", createObj);

                            voucherCRUD.update({Id: id}, updateObj,function (err, data) {

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

exports.updateContact = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var updateObj = {
                                "Email" : req.body.Email,
                                "Address": req.body.Address,
                                "ContactNo" : req.body.ContactNo,
                                "Fax": req.body.Fax,
                                "ModifiedOn": dateToday || "",        
                            };
                            // console.log("after", createObj);

                            userCRUD.update({UserId: req.body.UserId}, updateObj,function (err, data) {

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

exports.updateOpHours = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var updateObj = {
                                "Days" : req.body.Days,
                                "FromTime" : req.body.FromTime,
                                "ToTime": req.body.ToTime,
                                "ModifiedOn": dateToday || "",        
                            };
                            // console.log("after", createObj);

                            opHourCRUD.update({Id: req.body.Id}, updateObj,function (err, data) {

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

exports.addHoliday= function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
        
    var createObj = {
                                "Title" : req.body.Title,
                                "Description": req.body.Description,
                                "CreatedOn": dateToday || "",        
                            };
                            // console.log("after", createObj);

                            holidaysCRUD.create(createObj, function (err, data) {

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

exports.updateHoliday = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var updateObj = {
                                "Title" : req.body.Title,
                                "Description": req.body.Description,
                                "ModifiedOn": dateToday || "",        
                            };
                            // console.log("after", createObj);

                            holidaysCRUD.update({Id: req.body.Id}, updateObj,function (err, data) {

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



exports.deleteHoliday = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var id = req.params.id;
    var updateObj = {
                         "IsDeleted" :  '1',
      
                    };
                            // console.log("after", createObj);

                            holidaysCRUD.update({Id: id}, updateObj,function (err, data) {

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