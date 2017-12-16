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
                else if(data.verifyValid === false)
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


    $scope.updatepassword = function(info) {      

          $scope.info.Admin_Id = window.localStorage.getItem('Admin_Id');

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
                            document.editpassword.reset(); 
                            window.location.href = "dashboard.html";
                        }

                    });  

          }     

        
          
    } 

  
});