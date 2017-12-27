app.controller('contactcontroller', function ($scope, $location, $http, $window) {

  //----------- Book Now ------------------------///

  $scope.adults = ['1','2','3','4','5','6','7','8','9','10'];
  $scope.child = ['0','1','2','3','4','5','6','7','8','9','10'];
 // $scope.urlParams = $location.search();
 // console.log($location.search());
 // $scope.data = {};
  $scope.hide = window.sessionStorage.getItem('hide');

  $scope.checkPassword = function(password){
 
      //console.log(password);
      $('#alert').hide();
      // if ($scope.password == 'ambitiontours')
      //   $('#form-wrap').hide();
      // else
      //   $('#alert').show();
       if (password == 'ambitiontours')
       {
         $('#form-wrap').hide();
         window.sessionStorage.setItem('hide','hidden');
         $scope.hide = 'hidden';
       }
       else
        $('#alert').show();


 }

 $scope.enquiryButton = function(packagename,price){
 // alert(+"--"+price);
     window.localStorage.removeItem("packagename");
     window.localStorage.removeItem("packagePrice");
      window.localStorage.clear();

    window.localStorage.setItem("packagename",packagename);
    window.localStorage.setItem("packagePrice",price);
   /* $scope.packagename = packagename;
    $scope.packagePrice = price;*/

    location.href='/enquiry.html';
 }


  $scope.booktour = function (req, res) {

    $scope.alertmessage = '';

    if (typeof $scope.Tour.adults === 'undefined') 
    {
         $scope.alertmessage = 'Please select no of adults';
    }
    else if(typeof $scope.Tour.Child === 'undefined') 
    {
         $scope.alertmessage = 'Please select no of children';
    }
    else if($scope.Tour.TourType === 'Attraction' && typeof $scope.Tour.paymenttype === 'undefined') 
    {
         $scope.alertmessage = 'Please select paymenttype';
    }
    else
    {

       $http.post(baseurl + 'booktour/', $scope.Tour).success(function (res) {
          if (res.status == 'false') {
          }
          else
          {
            if ($scope.Tour.TourType == 'Attraction' && $scope.Tour.paymenttype=='Credit Card')
            {
                window.location.href = 'payment-option.html?BookId='+res.value;
            }
            else
            {
                $('#bookform').hide();
                $('#thankyou').show('slow');
            }

          }
        }).error(function () {
          console.log("error");
        })

    }

  }


  $scope.booknow = function (req, res) {

    console.info("in consult");


    //$scope.urlParams = $location.search();
    //alert($scope.urlParams.pck);
    $scope.data = {};

    $scope.data.fullname = $scope.fullname;
    $scope.data.email = $scope.email;
    $scope.data.travelDate = $scope.travelDate;
    $scope.data.phonenumber = $scope.phonenumber;
    $scope.data.message = $scope.message;
    $scope.data.packageName = window.localStorage.getItem("packagename");
    $scope.data.packagePrice = window.localStorage.getItem("packagePrice");
    $scope.data.adults = $scope.adults;
    $scope.data.Child = $scope.Child;
    $scope.data.promoCode = $scope.promoCode;

    $http.post(baseurl + 'consult/', $scope.data).success(function (res) {
      if (res.status == 'false') {
      }
    }).error(function () {
      console.log("error");
    })
    window.localStorage.removeItem("packagename");
    window.localStorage.removeItem("packagePrice");
    document.contactform.reset();
    $("#thankyou").show();
    $("#thankyou").delay(3200).hide(300);

    location.href='/index.html';
  }

  $scope.getCountries = function() {

    $http.get(baseurl + 'allcountries').success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.countrylist = res;
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.countrylist);
            }

        }).error(function () {

        });

   }

    $scope.getallcountries = function() {

    $http.get(baseurl + 'getallcountries').success(function (res) {

            if (res.status == 'false') {

            }
            else {
                console.log(res);
                $scope.clist = res;
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.countrylist);
            }

        }).error(function () {

        });

   }

       $scope.gettourcountries = function() {

    $http.get(baseurl + 'gettourcountries').success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                // $scope.countrylist = res;
                 $scope.clist = res;
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.countrylist);
            }

        }).error(function () {

        });

   }


   $scope.getattractioncountries = function() {

    $http.get(baseurl + 'getattractioncountries').success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.countrylist = res;
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.countrylist);
            }

        }).error(function () {

        });

   }

   $scope.getAllVisaDetails = function() {

    $http.get(baseurl + 'getAllVisaDetails').success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.visalist = res;
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.countrylist);
            }

        }).error(function () {

        });

   }

   $scope.getVisa = function() {

    $http.get(baseurl + 'getVisa').success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.visa = res;
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.countrylist);
            }

        }).error(function () {

        });

   }

   $scope.getVisaDetails = function() {


    $http.get(baseurl + 'getVisaDetails/'+$scope.visa.Id).success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.visa = res;
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.countrylist);
            }

        }).error(function () {

        });

   }

  $scope.getCountryAttractions = function() {


        var url = window.location.href;
        var parts = url.split("?");
        if(parts.length>1){

           var urlparams = parts[1];
           var params = urlparams.split("&");
           var id = urlparams.split("=")
           if (id[0]=='country') 
           {

              $http.get(baseurl + 'getCountryAttractions/'+id[1]).success(function (res) {

                  if (res.status == 'false') {

                  }
                  else {

                     $http.get(baseurl + 'getCountryDetails/'+id[1]).success(function (data) {

                          if (data.status == 'false') {

                          }
                          else {

                              $scope.CountryId = id[1];
                              $scope.CountryTitle = data.CountryTitle;
                              $scope.attractionlist = res;
                          }

                      }).error(function () {

                      });
                  }

              }).error(function () {

              });

           }
           else
          {
              window.location.href = 'index.html';
          }
        }
        else
        {
            window.location.href = 'index.html';
        }

   }

      $scope.getCountryTours = function() {


     var url = window.location.href;
        var parts = url.split("?");
        if(parts.length>1){

           var urlparams = parts[1];
           var params = urlparams.split("&");
           var id = urlparams.split("=")
           if (id[0]=='country') 
           {

              $http.get(baseurl + 'getCountryTours/'+id[1]).success(function (res) {

                  if (res.status == 'false') {

                  }
                  else {

                     $http.get(baseurl + 'getCountryDetails/'+id[1]).success(function (data) {

                          if (data.status == 'false') {

                          }
                          else {

                              $scope.CountryId = id[1];
                              $scope.CountryTitle = data.CountryTitle;
                              $scope.tourlist = res;
                          }

                      }).error(function () {

                      });
                  }

              }).error(function () {

              });

           }
           else
          {
              window.location.href = 'asia.html';
          }
        }

   }



  $scope.getSingaporeAttractions = function (req, res) {

     var country = 'Singapore';
           $http.get(baseurl + 'getCountryId/'+country).success(function (res) {

                    if (res.status == 'false') {

                    }
                    else {

                      var countryId = res.CountryId;
                      $http.get(baseurl + 'getCountryAttractions/'+countryId).success(function (res) {

                        if (res.status == 'false') {

                        }
                        else {

                           $http.get(baseurl + 'getCountryDetails/'+countryId).success(function (data) {

                                if (data.status == 'false') {

                                }
                                else {

                                    $scope.CountryId = countryId;
                                    $scope.CountryTitle = data.CountryTitle;
                                    $scope.attractionlist = res;
                                }

                            }).error(function () {

                            });
                        }

                    }).error(function () {

                    });


                    }

            });


  }

         $scope.getAdminContactDetails = function() {

    $http.get(baseurl + 'getAdminContactDetails').success(function (res) {

            if (res.status == 'false') {

            }
            else {
                //console.log(res);
                $scope.contact = res;
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.countrylist);
            }

        }).error(function () {

        });

   }

     $scope.getOperatingHours = function() {

    $http.get(baseurl + 'getOperatingHours').success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.hours = res;
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.countrylist);
            }

        }).error(function () {

        });

   }

     $scope.getPublicHolidays = function() {

    $http.get(baseurl + 'getPublicHolidays').success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.holidays = res;
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.countrylist);
            }

        }).error(function () {

        });

   }

       $scope.getTourDetails = function() {             



        var url = window.location.href;
        var parts = url.split("?");
        if(parts.length>1){

           var urlparams = parts[1];
           var params = urlparams.split("&");
           var id = urlparams.split("=")
           if (id[0]=='TourId') 
           {
             $http.get(baseurl + 'getTourDetails/'+id[1]).success(function (res) {

                  if (res.status == 'false') {

                  }
                  else {
                      $scope.Tour = res;
                      $scope.Tour.adults = 2;
                      $scope.Tour.Child = 2;
                      $scope.Tour.AdultPrice = $scope.Tour.adults * $scope.Tour.TourCost;
                      $scope.Tour.ChildPrice = $scope.Tour.Child * $scope.Tour.ChildCost;
                      $scope.Tour.TotalAmount = $scope.Tour.AdultPrice + $scope.Tour.ChildPrice;

                  }

              }).error(function () {

              });
           }
           else
          {
              window.location.href = 'index.html';
          }
        }
        else
        {
            window.location.href = 'index.html';
        }
    } 

    $scope.calculateAmt = function (req, res) {

       $scope.Tour.AdultPrice = $scope.Tour.adults * $scope.Tour.TourCost;
       $scope.Tour.ChildPrice = $scope.Tour.Child * $scope.Tour.ChildCost;
       $scope.Tour.TotalAmount = $scope.Tour.AdultPrice + $scope.Tour.ChildPrice;

    }

  $scope.customTour = function (req, res) {

    console.info("in consult");


    //$scope.urlParams = $location.search();
    //alert($scope.urlParams.pck);
    $scope.data = {};

    $scope.data.fullname = $scope.fullname;
    $scope.data.email = $scope.email;
    $scope.data.travelDate = $scope.travelDate;
    $scope.data.phonenumber = $scope.phonenumber;
    $scope.data.message = $scope.message;
    /*$scope.data.packageName = window.localStorage.getItem("packagename");
    $scope.data.packagePrice = window.localStorage.getItem("packagePrice");
    $scope.data.adults = $scope.adults;
    $scope.data.Child = $scope.Child;
    $scope.data.promoCode = $scope.promoCode;*/

    console.log($scope.data);
    $http.post(baseurl + 'customTour/', $scope.data).success(function (res) {
      if (res.status == 'false') {
      }
    }).error(function () {
      console.log("error");
    })
    //window.localStorage.removeItem();
    document.contactform.reset();
    $("#contactform").hide();
    $("#thankyou").show();
   // $("#thankyou").delay(3200).hide(300);

    //location.href='/index.html';
  }

    $scope.airTicket = function (req, res) {


    $scope.data = {};

    $scope.data.fullname = $scope.fullname;
    $scope.data.phonenumber = $scope.phonenumber;
    $scope.data.email = $scope.email;
    $scope.data.from = $scope.from;
    $scope.data.destination = $scope.destination;
    $scope.data.airline = $scope.airline;
    $scope.data.type = $scope.type;

    $http.post(baseurl + 'airTicket/', $scope.data).success(function (res) {
      if (res.status == 'false') {
      }
    }).error(function () {
      console.log("error");
    })
    document.ticketform.reset();
    $("#ticketform").hide();
    $("#thankyou").show();
   // $("#thankyou").delay(3200).hide(300);

    //location.href='/index.html';
  }

    $scope.visaEnquiry = function (req, res) {

    //console.log($scope.visa);


    $http.post(baseurl + 'visaEnquiry/', $scope.visa).success(function (res) {
      if (res.status == 'false') {


      }
      else
      {
          document.visaform.reset();
          $("#modalclose").click();
          $("#thankyou").show();
          $("#thankyou").delay(3200).hide(300);

        //location.href='/index.html';

      }
    }).error(function () {
      console.log("error");
    })
   
  }

      $scope.getAllGiftVouchers = function() {

    $http.get(baseurl + 'getAllGiftVouchers').success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.voucherlist = res;
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.countrylist);
            }

        }).error(function () {

        });

   }

    $scope.showVoucher = function(voucher) {

          $scope.vc = voucher;
          $scope.vc.Quantity = 1;
          $scope.vc.TotalAmount = $scope.vc.Price * $scope.vc.Quantity;
   }

  $scope.purchasevoucher = function() {

    $http.post(baseurl + 'purchasevoucher',$scope.vc).success(function (res) {

            if (res.status == 'false') {

            }
            else {
               
              window.location.href = 'payment-option.html?VoucherBookId='+res.value;
            }

        }).error(function () {

        });

   }
       $scope.getSocial = function() {

    $http.get(baseurl + 'getSocial').success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.sociallist = res;
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.countrylist);
            }

        }).error(function () {

        });

   }

$scope.initfunc = function () {
     //$scope.data = {};
    console.log(window.localStorage.getItem("packagename"));

    /*  $scope.data.packagename = packagename;
    $scope.data.packagePrice = price;*/

    $("#thankyou").hide();
    /*var url = window.location.href;
    console.log(url);
    var parts = url.split("?");
    var params = parts[1];
    console.log(params);
    var package = params.split("=");
    console.log(package[1]);
    var packagename  = package[1] ;
    $scope.packagename = $scope.data.packagename;*/ // packagename.replace(new RegExp('%20', 'g'),' ');
    $("#packagePrice").val(window.localStorage.getItem("packagePrice"));
    $("#packageName").val(window.localStorage.getItem("packagename"));
   // alert($scope.packagename);

  }
});