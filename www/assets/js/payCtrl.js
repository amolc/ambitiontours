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

                  		console.log(res);
                   
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

});