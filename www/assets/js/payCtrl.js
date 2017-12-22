app.controller('paymentcontroller', function ($scope, $location, $http, $window) {

	$window.Stripe.setPublishableKey('pk_test_OhQmkdGJBvsyyfACNGMcGFXw');


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
                   
                        $scope.tourbook = res;
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

          console.log($scope.cardname);
          console.log($scope.number);
          console.log($scope.expiry);
          console.log($scope.cvc);
          console.log(result);

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
              

          }

      };

});

