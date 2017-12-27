app.controller('admincontroller', function ($scope, $location, $http, $window) {


          $scope.adminlogin = function(){

            $("#alertmessage").hide(); 

            $http.post(baseurl + 'adminlogin', $scope.logininfo).success(function(data, status) {

              console.log(data);

                if(data.usernameexist === false)
                {

                    $scope.alertmessage=data.message;
                    $("#alertmessage").show('slow');  

                }
                else
                {

                    if(data.passValid === true)
                    {

                        $scope.noemailpass = false;
                        $scope.noemail = false;
                        $scope.nopass = false;
                        $scope.loginFailure = false;
                        $scope.loginSuccess = true;

                        $scope.loginSuccessMsg = 'Successfully Login.';


                        window.localStorage.setItem('Admin_Id', data.value.UserId);
                        window.localStorage.setItem('Admin_UserName', data.value.UserName);
                        window.localStorage.setItem('Admin_Name', data.value.FirstName+' '+data.value.LastName);

                       if (window.localStorage.getItem("GoToPage") === null) {
                                 window.location = "dashboard.html";
                        }
                        else
                        {
                           window.location = window.localStorage.getItem("GoToPage")
                        }
                       
                    }
                    else
                    {
                        $scope.alertmessage=data.message;
                        $("#alertmessage").show('slow');    
                    }


                }
                

            });


    }

    $scope.isAdminLoggedin = function() {

                $scope.Admin_Id = 0;
               // console.log($scope.User_Id);

                //console.log(window.localStorage.getItem('User_Id'));
                if (window.localStorage.getItem('Admin_Id')>0) 
                {
                    $scope.Admin_Id =window.localStorage.getItem('Admin_Id');
                    $scope.Admin_UserName =window.localStorage.getItem('Admin_UserName');
                    $scope.Admin_Name =window.localStorage.getItem('Admin_Name');
                }

            } 

     $scope.adminlogout = function() {             

          //window.localStorage.clear();
          window.localStorage.removeItem('Admin_Id');
          window.localStorage.removeItem('Admin_UserName');
          window.localStorage.removeItem('Admin_Name');
          location.href = "index.html"
    }  

    $scope.getAdminDetails = function() {             

           var UserId = window.localStorage.getItem('Admin_Id');
            $http.get(baseurl + 'getAdminDetails/'+ UserId ).success(function (res) {

                  if (res.status == 'false') {

                  }
                  else {
                      $scope.info = res;
                     // console.log($scope.info);
                  }

              }).error(function () {

              });
    }  

    $scope.updatepassword = function(info) {      

          $scope.info.UserId = window.localStorage.getItem('Admin_Id');

           if (info.Password!=info.opassword) 
          {
              //$scope.alertmessage='Old Password Is Incorrect';
              $("#alertmessage").html('Old Password Is Incorrect');
              $("#alertmessage").show('slow');
          }
          else if (info.npassword!=info.cpassword) 
          {
             // $scope.alertmessage='Password And Confirm Password Should Be Same';
             $("#alertmessage").html('Password And Confirm Password Should Be Same');
             $("#alertmessage").show('slow');
          }
          else
          {

                   $http.post(baseurl + 'updatepassword', $scope.info).success(function(data, status) {

                  //      console.log('data',data)

                        if (data.status == false) 
                        {
                            // $scope.alertmessage=data.message;
                            // $("#alertmessage").show('slow');
                        }
                        else
                        {
                            window.location.href = "dashboard.html";
                        }

                    });  

          }            
          
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
               // console.log(res);
                $scope.countrylist = res;
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
                $scope.countrylist = res;
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

   $scope.getAllAttractions = function() {

    $http.get(baseurl + 'getAllAttractions').success(function (res) {

            if (res.status == 'false') {

            }
            else {
                $scope.attractionlist = res;
            }

        }).error(function () {

        });

   }

   $scope.getAllTours = function() {

    $http.get(baseurl + 'getAllTours').success(function (res) {

            if (res.status == 'false') {

            }
            else {
                $scope.tourlist = res;
            }

        }).error(function () {

        });

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
              window.location.href = 'tours.html';
          }
        }

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
              window.location.href = 'attractions.html';
          }
        }

   }

    $scope.getAllBookings = function() {

    $http.get(baseurl + 'getAllBookings').success(function (res) {

            if (res.status == 'false') {

            }
            else {
                //console.log(res);
                $scope.bookinglist = res;
            }

        }).error(function () {

        });

   }
   $scope.getAttractionBookings = function() {

    $http.get(baseurl + 'getAttractionBookings').success(function (res) {

            if (res.status == 'false') {

            }
            else {
                //console.log(res);
                $scope.abooking = res;
            }

        }).error(function () {

        });

   }

     $scope.getTourEnquiries = function() {

    $http.get(baseurl + 'getTourEnquiries').success(function (res) {

            if (res.status == 'false') {

            }
            else {
                //console.log(res);
                $scope.tbooking = res;
            }

        }).error(function () {

        });

   }

    $scope.getCustomTourEnquiries = function() {

    $http.get(baseurl + 'getCustomTourEnquiries').success(function (res) {

            if (res.status == 'false') {

            }
            else {
                //console.log(res);
                $scope.cbooking = res;
            }

        }).error(function () {

        });

   }

    $scope.getAirTicketEnquiries = function() {

    $http.get(baseurl + 'getAirTicketEnquiries').success(function (res) {

            if (res.status == 'false') {

            }
            else {
                //console.log(res);
                $scope.atbooking = res;
            }

        }).error(function () {

        });

   }

    $scope.getVisaEnquiries = function() {

    $http.get(baseurl + 'getVisaEnquiries').success(function (res) {

            if (res.status == 'false') {

            }
            else {
                //console.log(res);
                $scope.vbooking = res;
            }

        }).error(function () {

        });

   }

    $scope.getVoucherBookings = function() {

    $http.get(baseurl + 'getVoucherBookings').success(function (res) {

            if (res.status == 'false') {

            }
            else {
                //console.log(res);
                $scope.tvbooking = res;
            }

        }).error(function () {

        });

   }



    var attachmentfile1 = [];
    var filelength;

     $scope.forminit = function(ele) {

     
        // if (typeof $scope.Tour === 'undefined')
        // $scope.Tour = {};
        // var url = window.location.href;
        // var parts = url.split("?");
        // if(parts.length>1){

        //    var urlparams = parts[1];
        //    var params = urlparams.split("&");
        //    var type = urlparams.split("=")
        //    if (type[0]=='Type') 
        //    {
        //      $scope.Tour.TourType = type[1];
        //    }
        //    else
        //   {
        //       window.location.href = 'dashboard.html';
        //   }
        // }
        // else
        // {
        //    window.location.href = 'dashboard.html';
        // }
        if (typeof $scope.Tour === 'undefined')
        $scope.Tour = {};
        var url = window.location.href;
        var parts = url.split("?");
        var pageurl = parts[0].split("/");
        var filename = pageurl.pop();
        var country = 'Singapore';
        $http.get(baseurl + 'getCountryId/'+country).success(function (res) {

                    if (res.status == 'false') {

                    }
                    else {
                        $scope.CountryId = res.CountryId
                        // if (filename === 'attractions-form.html') 
                        // { 
                        //     $scope.Tour.CountryId = $scope.CountryId;
                        // }
                        // else if (filename === 'tours-form.html') 
                        //   {

                              if(parts.length>1){

                                 var urlparams = parts[1];
                                 var params = urlparams.split("&");
                                 var id = urlparams.split("=")
                                 if (id[0]=='country') 
                                 {

                                    $scope.Tour.CountryId = parseInt(id[1]);
                                 }

                              }
                              else
                              {
                                 $scope.Tour.CountryId = $scope.CountryId;
                                   
                              }

                         // }
                    }

                }).error(function () {

                });
      
        
        
        
       // $scope.Tour.CountryId = 1;
        $scope.attachmentCount = {};
        $scope.attachment = {};
        $scope.imgSrc = "";

    };

    $scope.updateattachment = function(file_browse) {

        var fileDisplayArea = document.getElementById('fileDisplayArea');
        // console.log(fileDisplayArea)
        if (file_browse == 'file_browse1') {
            var newfile = document.getElementById("file_browse1").files;
        }            
        var imageType = /image.*/;

         function readAndPreview(file) {

          // Make sure `file.name` matches our extensions criteria
          if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
            var reader = new FileReader();

            reader.addEventListener("load", function () {
              var image = new Image();
              image.height = 100;
              image.title = file.name;
              image.class = 'avatar img-circle img-thumbnail';
              image.src = this.result;
              //attachmentfile1.push(this.result); 
              attachmentfile1[0] = this.result;
              $scope.Tour.TourImage = file.name;
              
              /*if(filelength==index){
                callback(attachmentfile1);
              }*/
              imagepreview.appendChild( image );
            }, false);

            reader.readAsDataURL(file);
          }

        }

        if (newfile) {
          filelength = newfile.length;
          /*var index=0;
          for (var i = 0; i < newfile.length; i++) {
              readAndPreview(newfile[i],function(){
                console.log("done");
              });
              if(i==(newfile.length-1))
                console.log(attachmentfile1);

          };*/

          [].forEach.call(newfile,readAndPreview);
          setTimeout(function() { 
            //console.log(attachmentfile1.length);
            $scope.attachment.images = attachmentfile1;
            //$scope.userdetails.profile_image = attachmentfile1[0];
            $scope.attachmentCount.imagecount = attachmentfile1.length;
            //$scope.parameters.attachment = "testes testett";//{images:attachmentfile1};
            //$scope.parameters.attachment = JSON.stringify(images); 
            //$scope.addProduct($scope.parameters);
            //console.log(attachmentfile1); 
          }, 1000);
          
        }
        
    }

    $scope.addTour = function() {   


          $("#alertmessage").hide();

          if (typeof $scope.Tour.CountryId === 'undefined') 
          {
               $scope.alertmessage = "Please Select Country"
               $("#alertmessage").show('slow');
          }
          else
          {

             setTimeout(function() { 

               if (Object.keys($scope.attachment).length>0) {
                $scope.Tour.image = $scope.attachment.images[0];
              }else{
                $scope.Tour.image = '';
              }


            $http.post(baseurl + 'addTour/',$scope.Tour).success(function(res) {
                  
                //console.log(res);
                if (res.status == true) 
                {
                  if ($scope.Tour.TourType == 'Tour')
                    window.location.href = 'tours.html';
                  if ($scope.Tour.TourType == 'Attraction')
                    window.location.href = 'attractions.html';
                }

                }).error(function() {
                    
                });
         
              }, 1000);

           

          }          

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
                      $scope.attachmentCount = {};
                      $scope.attachment = {};
                      $scope.imgSrc = "";
                  }

              }).error(function () {

              });
           }
           else
          {
              window.location.href = 'dashboard.html';
          }
        }
        else
        {
            window.location.href = 'dashboard.html';
        }
    } 

    $scope.updateTour = function() {             


        setTimeout(function() { 

             if (Object.keys($scope.attachment).length>0) {
                $scope.Tour.image = $scope.attachment.images[0];
              }else{
                $scope.Tour.image = '';
              }

            $http.post(baseurl + 'updateTour/',$scope.Tour).success(function(res) {
  
                 if (res.status == true) 
                {
                  if ($scope.Tour.TourType == 'Tour')
                      window.location.href = 'country-tour.html?country='+$scope.Tour.CountryId;
                    //window.location.href = 'tours.html';
                  if ($scope.Tour.TourType == 'Attraction')
                    window.location.href = 'country-attractions.html?country='+$scope.Tour.CountryId;
                    //window.location.href = 'attractions.html';
                }

                }).error(function() {
                      // alert("Please check your internet connection or data source..");
                });
         }, 1000);
    } 

       $scope.deleteTour = function(id,type) {    


       var r = confirm("Are You Sure You want to Delete It?");
        if (r == true) 
        { 
          $http.get(baseurl + 'deleteTour/'+id).success(function(res) {

                  
               if (res.status == true) 
                {
                  if (type == 'Tour')
                      $scope.getCountryTours();
                    //window.location.href = 'tours.html';
                  if (type == 'Attraction')
                    $scope.getCountryAttractions();
                }

          }).error(function() {
                      // alert("Please check your internet connection or data source..");
         });
            
        }         

         
    }

     $scope.addCountry = function() {   


          //console.log($scope.Tour);


             setTimeout(function() { 

               if (Object.keys($scope.attachment).length>0) {
                $scope.Tour.image = $scope.attachment.images[0];
              }else{
                $scope.Tour.image = '';
              }


            $http.post(baseurl + 'addCountry/',$scope.Tour).success(function(res) {
                  
                //console.log(res);
                if (res.status == true) 
                {
                  
                    window.location.href = 'countries.html';
                }

                }).error(function() {
                    
                });
         
              }, 1000);    

    }

        $scope.getCountryDetails = function() {             



        var url = window.location.href;
        var parts = url.split("?");
        if(parts.length>1){

           var urlparams = parts[1];
           var params = urlparams.split("&");
           var id = urlparams.split("=")
           if (id[0]=='CountryId') 
           {
             $http.get(baseurl + 'getCountryDetails/'+id[1]).success(function (res) {

                  if (res.status == 'false') {

                  }
                  else {


                      $scope.Tour = res;
                      $scope.attachmentCount = {};
                      $scope.attachment = {};
                      $scope.imgSrc = "";
                  }

              }).error(function () {

              });
           }
           else
          {
              window.location.href = 'countries.html';
          }
        }
        else
        {
            window.location.href = 'countries.html';
        }
    } 

    $scope.updateCountry = function() {   


             setTimeout(function() { 

               if (Object.keys($scope.attachment).length>0) {
                $scope.Tour.image = $scope.attachment.images[0];
              }else{
                $scope.Tour.image = '';
              }
              console.log($scope.Tour);

            $http.post(baseurl + 'updateCountry/',$scope.Tour).success(function(res) {
                  
                //console.log(res);
                if (res.status == true) 
                {
                  
                    window.location.href = 'countries.html';
                }

                }).error(function() {
                    
                });
         
               }, 1000);    

    }

    $scope.deleteCountry = function(id) {    


       var r = confirm("Are You Sure You want to Delete It?");
        if (r == true) 
        { 
          $http.get(baseurl + 'deleteCountry/'+id).success(function(res) {

                  
               if (res.status == true) 
                {

                    window.location.href = 'countries.html';
                }

          }).error(function() {
                      // alert("Please check your internet connection or data source..");
         });
            
        }         
         
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

     $scope.getVisaDetails = function() {

       var url = window.location.href;
       var parts = url.split("?");
      if(parts.length>1){
           $scope.visa = {};
           var urlparams = parts[1];
           var params = urlparams.split("&");
           var id = urlparams.split("=");
           $scope.visa.Id = id[1];
          // console.log( $scope.visa.Id);
      }
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

      $scope.addVisa = function() {   



            $http.post(baseurl + 'addVisa/',$scope.visa).success(function(res) {
                  
                //console.log(res);
                if (res.status == true) 
                {
                  
                    window.location.href = 'visa.html';
                }

                }).error(function() {
                    
                });
     }

         $scope.updateVisa = function() {   



            $http.post(baseurl + 'updateVisa/',$scope.visa).success(function(res) {
                  
                //console.log(res);
                if (res.status == true) 
                {
                  
                    window.location.href = 'visa.html';
                }

                }).error(function() {
                    
                });
     }

           $scope.deleteVisa = function(id) {   


              var r = confirm("Are You Sure You want to Delete It?");
              if (r == true) 
              { 
            $http.get(baseurl + 'deleteVisa/'+id).success(function(res) {
                  
                //console.log(res);
                if (res.status == true) 
                {
                  
                    window.location.href = 'visa.html';
                }

                }).error(function() {
                    
                });

              }
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

     $scope.getVoucherDetails = function() {

       var url = window.location.href;
       var parts = url.split("?");
      if(parts.length>1){
           $scope.voucher = {};
           var urlparams = parts[1];
           var params = urlparams.split("&");
           var id = urlparams.split("=");
           $scope.voucher.Id = id[1];
          // console.log( $scope.visa.Id);
      }
      $http.get(baseurl + 'getVoucherDetails/'+$scope.voucher.Id).success(function (res) {

              if (res.status == 'false') {

              }
              else {
                 // console.log(res);
                  $scope.voucher = res;
                 // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
                 //console.log($scope.countrylist);
              }

          }).error(function () {

          });

     }

      $scope.addVoucher = function() {   



            $http.post(baseurl + 'addVoucher/',$scope.voucher).success(function(res) {
                  
                //console.log(res);
                if (res.status == true) 
                {
                  
                    window.location.href = 'gift-vouchers.html';
                }

                }).error(function() {
                    
                });
     }

         $scope.updateVoucher = function() {   



            $http.post(baseurl + 'updateVoucher/',$scope.voucher).success(function(res) {
                  
                //console.log(res);
                if (res.status == true) 
                {
                  
                    window.location.href = 'gift-vouchers.html';
                }

                }).error(function() {
                    
                });
     }

           $scope.deleteVoucher = function(id) {   


              var r = confirm("Are You Sure You want to Delete It?");
              if (r == true) 
              { 
            $http.get(baseurl + 'deleteVoucher/'+id).success(function(res) {
                  
                //console.log(res);
                if (res.status == true) 
                {
                  
                    window.location.href = 'gift-vouchers.html';
                }

                }).error(function() {
                    
                });

              }
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

     $scope.updateContact = function() {      


                   $http.post(baseurl + 'updateContact', $scope.contact).success(function(data, status) {

                  //      console.log('data',data)

                        if (data.status == false) 
                        {
                            // $scope.alertmessage=data.message;
                            // $("#alertmessage").show('slow');
                        }
                        else
                        {
                            window.location.href = "settings.html";
                        }

                    });  
      
          
    } 

        $scope.getOpHoursDetails = function() {

       var url = window.location.href;
       var parts = url.split("?");
        if(parts.length>1){
           $scope.hour = {};
           var urlparams = parts[1];
           var params = urlparams.split("&");
           var id = urlparams.split("=");
           $scope.hour.Id = id[1];
          // console.log( $scope.visa.Id);
      }
      $http.get(baseurl + 'getOpHoursDetails/'+$scope.hour.Id).success(function (res) {

              if (res.status == 'false') {

              }
              else {
                 // console.log(res);
                  $scope.hour = res;
                 // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
                 //console.log($scope.countrylist);
              }

          }).error(function () {

          });

     } 


         $scope.updateOpHours = function() {      


                   $http.post(baseurl + 'updateOpHours', $scope.hour).success(function(data, status) {

                  //      console.log('data',data)

                        if (data.status == false) 
                        {
                            // $scope.alertmessage=data.message;
                            // $("#alertmessage").show('slow');
                        }
                        else
                        {
                            window.location.href = "settings.html";
                        }

                    });  
      
          
    }

    $scope.getHolidayDetails = function() {

       var url = window.location.href;
       var parts = url.split("?");
      if(parts.length>1){
           $scope.holiday = {};
           var urlparams = parts[1];
           var params = urlparams.split("&");
           var id = urlparams.split("=");
           $scope.holiday.Id = id[1];
          // console.log( $scope.visa.Id);
      }
      $http.get(baseurl + 'getHolidayDetails/'+$scope.holiday.Id).success(function (res) {

              if (res.status == 'false') {

              }
              else {
                 // console.log(res);
                  $scope.holiday = res;
                 // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
                 //console.log($scope.countrylist);
              }

          }).error(function () {

          });

     }

      $scope.addHoliday = function() {   



            $http.post(baseurl + 'addHoliday/',$scope.holiday).success(function(res) {
                  
                //console.log(res);
                if (res.status == true) 
                {
                  
                    window.location.href = 'settings.html';
                }

                }).error(function() {
                    
                });
     }

         $scope.updateHoliday = function() {   



            $http.post(baseurl + 'updateHoliday/',$scope.holiday).success(function(res) {
                  
                //console.log(res);
                if (res.status == true) 
                {
                  
                    window.location.href = 'settings.html';
                }

                }).error(function() {
                    
                });
     }

           $scope.deleteHoliday = function(id) {   


              var r = confirm("Are You Sure You want to Delete It?");
              if (r == true) 
              { 
            $http.get(baseurl + 'deleteHoliday/'+id).success(function(res) {
                  
                //console.log(res);
                if (res.status == true) 
                {
                  
                    window.location.href = 'settings.html';
                }

                }).error(function() {
                    
                });

              }
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


      $scope.addSocial = function() {   


          //console.log($scope.Tour);


             setTimeout(function() { 

               if (Object.keys($scope.attachment).length>0) {
                $scope.Tour.image = $scope.attachment.images[0];
              }else{
                $scope.Tour.image = '';
              }


            $http.post(baseurl + 'addSocial/',$scope.Tour).success(function(res) {
                  
                //console.log(res);
                if (res.status == true) 
                {
                  
                    window.location.href = 'settings.html';
                }

                }).error(function() {
                    
                });
         
              }, 1000);    

    }

        $scope.getSocialDetails = function() {             



        var url = window.location.href;
        var parts = url.split("?");
        if(parts.length>1){

           var urlparams = parts[1];
           var params = urlparams.split("&");
           var id = urlparams.split("=")
           if (id[0]=='SocialId') 
           {
             $http.get(baseurl + 'getSocialDetails/'+id[1]).success(function (res) {

                  if (res.status == 'false') {

                  }
                  else {


                      $scope.Tour = res;
                      $scope.attachmentCount = {};
                      $scope.attachment = {};
                      $scope.imgSrc = "";
                  }

              }).error(function () {

              });
           }
           else
          {
              window.location.href = 'settings.html';
          }
        }
        else
        {
            window.location.href = 'settings.html';
        }
    } 

    $scope.updateSocial = function() {   


             setTimeout(function() { 

               if (Object.keys($scope.attachment).length>0) {
                $scope.Tour.image = $scope.attachment.images[0];
              }else{
                $scope.Tour.image = '';
              }
              console.log($scope.Tour);

            $http.post(baseurl + 'updateSocial/',$scope.Tour).success(function(res) {
                  
                //console.log(res);
                if (res.status == true) 
                {
                  
                    window.location.href = 'settings.html';
                }

                }).error(function() {
                    
                });
         
               }, 1000);    

    }

    $scope.deleteSocial = function(id) {    


       var r = confirm("Are You Sure You want to Delete It?");
        if (r == true) 
        { 
          $http.get(baseurl + 'deleteSocial/'+id).success(function(res) {

                  
               if (res.status == true) 
                {

                    window.location.href = 'settings.html';
                }

          }).error(function() {
                      // alert("Please check your internet connection or data source..");
         });
            
        }         
         
    }

     $scope.deleteAttractionBookings = function(id) {    


       var r = confirm("Are You Sure You want to Delete It?");
        if (r == true) 
        { 
          $http.get(baseurl + 'deleteAttractionBookings/'+id).success(function(res) {

                  
               if (res.status == true) 
                {

                  $scope.getAttractionBookings();
                  
                }

          }).error(function() {
                      // alert("Please check your internet connection or data source..");
         });
            
        }         

         
    }

     $scope.deleteTourEnquiries = function(id) {    


       var r = confirm("Are You Sure You want to Delete It?");
        if (r == true) 
        { 
          $http.get(baseurl + 'deleteTourEnquiries/'+id).success(function(res) {

                  
               if (res.status == true) 
                {

                  $scope.getTourEnquiries();
                  
                }

          }).error(function() {
                      // alert("Please check your internet connection or data source..");
         });
            
        }         

         
    }

     $scope.deleteCustomTourEnquiries = function(id) {    


       var r = confirm("Are You Sure You want to Delete It?");
        if (r == true) 
        { 
          $http.get(baseurl + 'deleteCustomTourEnquiries/'+id).success(function(res) {

                  
               if (res.status == true) 
                {

                  $scope.getCustomTourEnquiries();
                  
                }

          }).error(function() {
                      // alert("Please check your internet connection or data source..");
         });
            
        }         

         
    }

     $scope.deleteAirTicketEnquiries = function(id) {    


       var r = confirm("Are You Sure You want to Delete It?");
        if (r == true) 
        { 
          $http.get(baseurl + 'deleteAirTicketEnquiries/'+id).success(function(res) {

                  
               if (res.status == true) 
                {

                  $scope.getAirTicketEnquiries();
                  
                }

          }).error(function() {
                      // alert("Please check your internet connection or data source..");
         });
            
        }         

         
    }

     $scope.deleteVisaEnquiries = function(id) {    


       var r = confirm("Are You Sure You want to Delete It?");
        if (r == true) 
        { 
          $http.get(baseurl + 'deleteVisaEnquiries/'+id).success(function(res) {

                  
               if (res.status == true) 
                {

                  $scope.getVisaEnquiries();
                  
                }

          }).error(function() {
                      // alert("Please check your internet connection or data source..");
         });
            
        }         

         
    }

     $scope.deleteVoucherBookings = function(id) {    


       var r = confirm("Are You Sure You want to Delete It?");
        if (r == true) 
        { 
          $http.get(baseurl + 'deleteVoucherBookings/'+id).success(function(res) {

                  
               if (res.status == true) 
                {

                  $scope.getVoucherBookings();
                  
                }

          }).error(function() {
                      // alert("Please check your internet connection or data source..");
         });
            
        }         

         
    }


     $scope.getTourBookingDetails = function() {             

        var url = window.location.href;
        var parts = url.split("?");
        if(parts.length>1){

           var urlparams = parts[1];
           var params = urlparams.split("&");
           var id = urlparams.split("=")

             $http.get(baseurl + 'getTourBookingDetails/'+id[1]).success(function (res) {

                  if (res.status == 'false') {

                  }
                  else {
                      $scope.book = res;
                      console.log($scope.book);
                  }

              }).error(function () {

              });
          
        }
        else
        {
            window.location.href = 'dashboard.html';
        }
    } 





  
});