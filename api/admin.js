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
var socialCRUD = CRUD(db, 'tbl_SocialIcons');
var ctourCRUD = CRUD(db, 'tbl_CustomTours');
var ticketCRUD = CRUD(db,'tbl_AirTickets');
var venquiryCRUD = CRUD(db,'tbl_VisaEnquiries');
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

exports.gettourcountries = function (req, res) {
    var sql = "SELECT `CountryId`,`CountryTitle`,`CountryImage` FROM `tbl_Countries` WHERE `IsDeleted` = '0' AND `Tour`=1";
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.getattractioncountries = function (req, res) {
    var sql = "SELECT `CountryId`,`CountryTitle`,`CountryImage` FROM `tbl_Countries` WHERE `IsDeleted` = '0' AND `Attraction`=1";
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
  var sql = "SELECT `CountryId`,`CountryTitle`,`CountryImage`,`Tour`,`Attraction` FROM `tbl_Countries` WHERE CountryId = '"+id+"'";    
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

  var sql = "SELECT b.`BookingId`  as Id,b.`fullName` as name,b.`email` as email,b.`phoneNumber` as phone,b.`createDate` as date,t.`TourType` as Type FROM `tbl_Bookings` as b LEFT JOIN b.`TourId` = t.`TourId` WHERE t.`TourType` = 'Attraction' AND b.`IsDeleted` = '0' UNION SELECT v.`VBookId` as Id,v.`Name` as name,v.`Email` as email,v.`Contact` as phone,v.`CreatedOn` as date,'Voucher' as Type FROM `tbl_VoucherBooking` as v WHERE v.`IsDeleted` = '0' ORDER BY date DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
    
};

exports.getAttractionBookings = function(req, res){

  //var sql = "SELECT b.`BookingId`  as Id,b.`fullName` as name,b.`email` as email,b.`phoneNumber` as phone,b.`createDate` as date,t.`TourType` as Type FROM `tbl_Bookings` as b LEFT JOIN b.`TourId` = t.`TourId` WHERE t.`TourType` = 'Attraction' AND b.`IsDeleted` = '0' UNION SELECT v.`VBookId` as Id,v.`Name` as name,v.`Email` as email,v.`Contact` as phone,v.`CreatedOn` as date,'Voucher' as Type FROM `tbl_VoucherBooking` as v WHERE v.`IsDeleted` = '0' ORDER BY date DESC";
    var sql = "SELECT b.`BookingId`,b.`fullName`,b.`email`,b.`phoneNumber`,b.`TourTitle`,b.`TourCost`,b.`ChildCost`,b.`adults`,b.`Child`,b.`TotalAmount` FROM `tbl_Bookings` as b LEFT JOIN `tbl_Tours` as t ON b.`TourId` = t.`TourId`  WHERE t.`TourType`= 'Attraction' AND b.`IsDeleted`='0' ORDER BY b.`BookingId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
    
};

exports.getTourEnquiries = function(req, res){

  //var sql = "SELECT b.`BookingId`  as Id,b.`fullName` as name,b.`email` as email,b.`phoneNumber` as phone,b.`createDate` as date,t.`TourType` as Type FROM `tbl_Bookings` as b LEFT JOIN b.`TourId` = t.`TourId` WHERE t.`TourType` = 'Attraction' AND b.`IsDeleted` = '0' UNION SELECT v.`VBookId` as Id,v.`Name` as name,v.`Email` as email,v.`Contact` as phone,v.`CreatedOn` as date,'Voucher' as Type FROM `tbl_VoucherBooking` as v WHERE v.`IsDeleted` = '0' ORDER BY date DESC";
    var sql = "SELECT b.`BookingId`,b.`fullName`,b.`email`,b.`phoneNumber`,b.`TourTitle`,b.`TourCost`,b.`ChildCost`,b.`adults`,b.`Child`,b.`TotalAmount` FROM `tbl_Bookings` as b LEFT JOIN `tbl_Tours` as t ON b.`TourId` = t.`TourId`  WHERE t.`TourType`= 'Tour' AND b.`IsDeleted`='0' ORDER BY b.`BookingId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
    
};

exports.getCustomTourEnquiries = function(req, res){

  //var sql = "SELECT b.`BookingId`  as Id,b.`fullName` as name,b.`email` as email,b.`phoneNumber` as phone,b.`createDate` as date,t.`TourType` as Type FROM `tbl_Bookings` as b LEFT JOIN b.`TourId` = t.`TourId` WHERE t.`TourType` = 'Attraction' AND b.`IsDeleted` = '0' UNION SELECT v.`VBookId` as Id,v.`Name` as name,v.`Email` as email,v.`Contact` as phone,v.`CreatedOn` as date,'Voucher' as Type FROM `tbl_VoucherBooking` as v WHERE v.`IsDeleted` = '0' ORDER BY date DESC";
    var sql = "SELECT b.`CTourId`,b.`fullName`,b.`EmailId`,b.`phoneNumber` FROM `tbl_CustomTours` as b WHERE b.`IsDeleted`='0' ORDER BY b.`CTourId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
    
};

exports.getAirTicketEnquiries = function(req, res){

  //var sql = "SELECT b.`BookingId`  as Id,b.`fullName` as name,b.`email` as email,b.`phoneNumber` as phone,b.`createDate` as date,t.`TourType` as Type FROM `tbl_Bookings` as b LEFT JOIN b.`TourId` = t.`TourId` WHERE t.`TourType` = 'Attraction' AND b.`IsDeleted` = '0' UNION SELECT v.`VBookId` as Id,v.`Name` as name,v.`Email` as email,v.`Contact` as phone,v.`CreatedOn` as date,'Voucher' as Type FROM `tbl_VoucherBooking` as v WHERE v.`IsDeleted` = '0' ORDER BY date DESC";
    var sql = "SELECT b.`Id`,b.`Name`,b.`Email`,b.`Contact` FROM `tbl_AirTickets` as b WHERE b.`IsDeleted`='0' ORDER BY b.`Id` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
    
};

exports.getVisaEnquiries = function(req, res){

  //var sql = "SELECT b.`BookingId`  as Id,b.`fullName` as name,b.`email` as email,b.`phoneNumber` as phone,b.`createDate` as date,t.`TourType` as Type FROM `tbl_Bookings` as b LEFT JOIN b.`TourId` = t.`TourId` WHERE t.`TourType` = 'Attraction' AND b.`IsDeleted` = '0' UNION SELECT v.`VBookId` as Id,v.`Name` as name,v.`Email` as email,v.`Contact` as phone,v.`CreatedOn` as date,'Voucher' as Type FROM `tbl_VoucherBooking` as v WHERE v.`IsDeleted` = '0' ORDER BY date DESC";
    var sql = "SELECT b.`EnquiryId`,b.`Name`,b.`Email`,b.`Contact`,v.`Country`,v.`VisaCharge` FROM `tbl_VisaEnquiries` as b LEFT JOIN `tbl_VisaDetails` as v ON b.`VisaDetailId` =v.`Id` WHERE b.`IsDeleted`='0' ORDER BY b.`EnquiryId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
    
};

exports.getVoucherBookings = function(req, res){

  //var sql = "SELECT b.`BookingId`  as Id,b.`fullName` as name,b.`email` as email,b.`phoneNumber` as phone,b.`createDate` as date,t.`TourType` as Type FROM `tbl_Bookings` as b LEFT JOIN b.`TourId` = t.`TourId` WHERE t.`TourType` = 'Attraction' AND b.`IsDeleted` = '0' UNION SELECT v.`VBookId` as Id,v.`Name` as name,v.`Email` as email,v.`Contact` as phone,v.`CreatedOn` as date,'Voucher' as Type FROM `tbl_VoucherBooking` as v WHERE v.`IsDeleted` = '0' ORDER BY date DESC";
    var sql = "SELECT b.`VBookId`,b.`Name`,b.`Email`,b.`Contact`,b.`Price`,b.`Quantity`,b.`TotalAmount` FROM `tbl_VoucherBooking` as b WHERE b.`IsDeleted`='0' ORDER BY b.`VBookId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
    
};


exports.getTourBookingDetails = function(req, res){

  var id = req.params.id;
  var sql = "SELECT b.*,t.`TourType`,t.`TourImage`,t.`TourTitle` FROM `tbl_Bookings` as b LEFT JOIN `tbl_Tours` as t ON b.`TourId` = t.`TourId` WHERE BookingId= '"+id+"'";    
  db.query(sql, function (err, data) {
        res.json(data[0]);
    });
    
};

exports.getCustomTourDetails = function(req, res){

  var id = req.params.id;
  var sql = "SELECT * FROM `tbl_CustomTours` WHERE CTourId= '"+id+"'";    
  db.query(sql, function (err, data) {
        res.json(data[0]);
    });
    
};

exports.getAirTicketDetails = function(req, res){

  var id = req.params.id;
  var sql = "SELECT * FROM `tbl_AirTickets` WHERE Id= '"+id+"'";    
  db.query(sql, function (err, data) {
        res.json(data[0]);
    });
    
};

exports.getVisaEnquiriesDetails = function(req, res){

  var id = req.params.id;
  var sql = "SELECT v.*,d.`Country`,d.`VisaCharge`,d.`WorkingDays` FROM `tbl_VisaEnquiries` as v LEFT JOIN `tbl_VisaDetails` as d ON v.`VisaDetailId` = d.`Id` WHERE EnquiryId= '"+id+"'";    
  db.query(sql, function (err, data) {
        res.json(data[0]);
    });
    
};

exports.getVoucherBookingDetails = function(req, res){

  var id = req.params.id;
  var sql = "SELECT * FROM `tbl_VoucherBooking` WHERE VBookId= '"+id+"'";    
  db.query(sql, function (err, data) {
        res.json(data[0]);
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

exports.getSocial = function(req, res){ 

  var sql = "SELECT `Id`,`Link`,`Image` FROM `tbl_SocialIcons` WHERE `IsDeleted` = '0'";
    db.query(sql, function (err, data) {
        res.json(data);
    });
    
};

exports.getSocialDetails = function(req, res){

  var id = req.params.id;
  var sql = "SELECT `Id`,`Link`,`Image` FROM `tbl_SocialIcons` WHERE Id = '"+id+"'";    
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
                                "Tour" : req.body.Tour,
                                "Attraction" : req.body.Attraction,
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

   // console.log(req.body);

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
                                "Tour" : req.body.Tour,
                                "Attraction" : req.body.Attraction,
                                "ModifiedOn": dateToday || "",        
                            };
                             //console.log("after", updateObj);

                            countriesCRUD.update({CountryId: req.body.CountryId}, updateObj,function (err, data) {

                                if (!err) 
                                {
                                    var resdata = {
                                        status: true,
                                        value:data,
                                        message: 'Details successfully updated',
                                        date : dateToday
                                    };
                                   // console.log(resdata)

                                   res.jsonp(resdata);
                                }
                                else
                                {
                                    var resdata = {
                                        status: false,
                                        error: err,
                                        message: 'Error: Details not successfully updated. '
                                    };
                                    // console.log(resdata)

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
                                "ChildCost" : req.body.ChildCost || "", 
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
                                "ChildCost" : req.body.ChildCost || "", 
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


exports.addSocial = function (req, res) {

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
         fs.writeFileSync('www/uploads/social/' + fileName, imageBuffer, 'utf8');

     }else {
         fileName = '';
         console.log("image not present");
     }
        
    var createObj = {
                                "Link" : req.body.Link,
                                "Image": fileName || "", 
                                "CreatedOn": dateToday || "",        
                            };
                            // console.log("after", createObj);

                            socialCRUD.create(createObj, function (err, data) {

                                if (!err) 
                                {
                                    var resdata = {
                                        status: true,
                                        value:data,
                                        message: 'Details successfully added',
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

exports.updateSocial = function (req, res) {

   // console.log(req.body);

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
         fs.writeFileSync('www/uploads/social/' + fileName, imageBuffer, 'utf8');
     }else {
         fileName = req.body.Image;
         console.log("image not present");
     }
        
    var updateObj = {
                                "Link" : req.body.Link,
                                "Image": fileName || "", 
                                "ModifiedOn": dateToday || "",        
                            };
                             //console.log("after", updateObj);

                            socialCRUD.update({Id: req.body.Id}, updateObj,function (err, data) {

                                if (!err) 
                                {
                                    var resdata = {
                                        status: true,
                                        value:data,
                                        message: 'Details successfully updated',
                                    };
                                   // console.log(resdata)

                                   res.jsonp(resdata);
                                }
                                else
                                {
                                    var resdata = {
                                        status: false,
                                        error: err,
                                        message: 'Error: Details not successfully updated. '
                                    };
                                    // console.log(resdata)

                                    res.jsonp(resdata);
                                }
                            });
};



exports.deleteSocial = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var id = req.params.id;
    var updateObj = {
                         "IsDeleted" :  '1',
      
                    };
                            // console.log("after", createObj);

                            socialCRUD.update({Id: id}, updateObj,function (err, data) {

                                if (!err) 
                                {
                                    var resdata = {
                                        status: true,
                                        value:data,
                                        message: 'Details successfully deleted',
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

exports.deleteBookings = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var id = req.params.id;
    var updateObj = {
                         "IsDeleted" :  '1',
      
                    };
                            // console.log("after", createObj);

                            bookCRUD.update({BookingId: id}, updateObj,function (err, data) {

                                if (!err) 
                                {
                                    var resdata = {
                                        status: true,
                                        value:data,
                                        message: 'Details successfully deleted',
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

exports.deleteCustomTourEnquiries = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var id = req.params.id;
    var updateObj = {
                         "IsDeleted" :  '1',
      
                    };
                            // console.log("after", createObj);

                            ctourCRUD.update({CTourId: id}, updateObj,function (err, data) {

                                if (!err) 
                                {
                                    var resdata = {
                                        status: true,
                                        value:data,
                                        message: 'Details successfully deleted',
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

exports.deleteAirTicketEnquiries = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var id = req.params.id;
    var updateObj = {
                         "IsDeleted" :  '1',
      
                    };
                            // console.log("after", createObj);

                            ticketCRUD.update({Id: id}, updateObj,function (err, data) {

                                if (!err) 
                                {
                                    var resdata = {
                                        status: true,
                                        value:data,
                                        message: 'Details successfully deleted',
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

exports.deleteVisaEnquiries = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var id = req.params.id;
    var updateObj = {
                         "IsDeleted" :  '1',
      
                    };
                            // console.log("after", createObj);

                            venquiryCRUD.update({EnquiryId: id}, updateObj,function (err, data) {

                                if (!err) 
                                {
                                    var resdata = {
                                        status: true,
                                        value:data,
                                        message: 'Details successfully deleted',
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

exports.deleteVoucherBookings = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    var id = req.params.id;
    var updateObj = {
                         "IsDeleted" :  '1',
      
                    };
                            // console.log("after", createObj);

                            vbookCRUD.update({VBookId: id}, updateObj,function (err, data) {

                                if (!err) 
                                {
                                    var resdata = {
                                        status: true,
                                        value:data,
                                        message: 'Details successfully deleted',
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