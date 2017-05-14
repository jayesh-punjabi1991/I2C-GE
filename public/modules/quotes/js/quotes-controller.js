define(['angular', './module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('QuotesCtrl', ['$scope', '$log','$timeout','QuotesService','$http','PredixUserService','$window', function ($scope, $log,$timeout,QuotesService,$http,PredixUserService,$window) {
      $scope.QuotesList=[];
      if($window.sessionStorage.getItem('auth_token')){
        QuotesService.getQuotesList().then(function success(response){
          angular.forEach(response.data,function(value,key){
            $scope.QuotesList.push({"quote#":value.status== 'Accepted' ? "<a id='quote' href='/quoteDetails/"+value.quote_number+ "'>"+value.quote_number+"</a>" : "<a href='/quoteDetails/"+value.quote_number+"'>"+value.quote_number+"</a>","quoteVer":value.quote_version,"createdDate":value.quote_date,"status":value.status,"action":value.status=='Accepted' ? "<a title='Accept Quote' style='color:Green !important' href='/quoteDetails'><i class='fa fa-thumbs-up' aria-hidden='true'></i></a>" : ""});
          });
        });
      }
    }]);
});
