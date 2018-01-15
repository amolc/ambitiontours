app.controller('paymentcontroller', function ($scope, $location, $http, $window) {

	$window.Stripe.setPublishableKey('pk_test_OhQmkdGJBvsyyfACNGMcGFXw');

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


	$scope.getPaymentDetails = function() {


        var url = window.location.href;
        var parts = url.split("?");
        if(parts.length>1){

           var urlparams = parts[1];
           var params = urlparams.split("&");
           var id = urlparams.split("=")
           if (id[0]=='BookId') 
           {

              $http.get(baseurl + 'getTourBookingDetails/'+id[1]).success(function (res) {

                  if (res.status == 'false') {

                  }
                  else {
                 		//console.log(res);
                    if (res.PaymentStatus=='Pending')
                      $scope.tourbook = res;
                    else if (res.PaymentStatus=='Paid')
                      window.location.href = 'index.html';
                  
                  }

              }).error(function () {

              });

           }
          else if (id[0]=='VoucherBookId') 
           {

              $http.get(baseurl + 'getVoucherBookingDetails/'+id[1]).success(function (res) {

                  if (res.status == 'false') {

                  }
                  else {
                    //console.log(res);
                    if (res.PaymentStatus=='Pending')
                      $scope.voucherbook = res;
                    else if (res.PaymentStatus=='Paid')
                      window.location.href = 'index.html';
                  
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

         $scope.stripeCallback = function (code, result) {

          // console.log($scope.cardname);
          // console.log($scope.number);
          // console.log($scope.expiry);
          // console.log($scope.cvc);
          // console.log(result);

          if (result.error) {
               // window.alert('it failed! error: ' + result.error.message);
                $scope.paymessage = result.error.message ;
                $scope.transactionid = result.id ;

          } else {

          	if (typeof $scope.tourbook !== 'undefined')
          	{

          		$scope.tourbook.stripeToken = result.id ;
          		$http.post(baseurl + 'tourPayment/',$scope.tourbook).success(function (res) {

                  if (res.status == 'false') {

                  }
                  else {
                       
                       window.location.href = 'index.html';
                  }

              }).error(function () {

              });


          	}
            else if(typeof $scope.voucherbook !== 'undefined')
            {

              $scope.voucherbook.stripeToken = result.id ;
              $http.post(baseurl + 'voucherPayment/',$scope.voucherbook).success(function (res) {

                  if (res.status == 'false') {

                  }
                  else {
                       
                       window.location.href = 'index.html';
                  }

              }).error(function () {

              });


            }
              

          }

      };

});

