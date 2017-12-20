'use strict';
var app = angular.module('80consult', ['angular-storage']);
if (document.location.hostname == "ambitiontours.80startups.com")
{
  var baseurl = "https://ambitiontours.80startups.com/api/";

}
else if (document.location.hostname == "www.ambitiontours.80startups.com")
{
  var baseurl = "https://www.ambitiontours.80startups.com/api/";

}else if (document.location.hostname == "www.ambitiontours.com")
{
  var baseurl = "https://www.ambitiontours.com/api/";

}else if (document.location.hostname == "ambitiontours.com")
{
  var baseurl = "https://ambitiontours.com/api/";

}else{

  var baseurl = "http://localhost:6008/api/";
}

app.config(['storeProvider', function (storeProvider) {
  storeProvider.setStore('sessionStorage');
}]);
