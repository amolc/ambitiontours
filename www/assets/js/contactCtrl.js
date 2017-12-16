app.controller('contactcontroller', function ($scope, $location, $http, $window) {

  //----------- Book Now ------------------------///

  $scope.adults = ['0','1','2','3','4','5','6','7','8','9','10'];
  $scope.child = ['0','1','2','3','4','5','6','7','8','9','10'];
 // $scope.urlParams = $location.search();
 // console.log($location.search());
 // $scope.data = {};

  $scope.checkPassword = function(){
 
      $('#alert').hide();
      if ($scope.password == 'ambitiontours')
        $('#form-wrap').hide();
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


    $http.post(baseurl + 'customTour/', $scope.data).success(function (res) {
      if (res.status == 'false') {
      }
    }).error(function () {
      console.log("error");
    })
    window.localStorage.removeItem();
    document.contactform.reset();
    $("#thankyou").show();
    $("#thankyou").delay(3200).hide(300);

    location.href='/index.html';
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