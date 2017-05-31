define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('QuotesCtrl', ['$scope', '$log', '$timeout', 'QuotesService', '$http', 'PredixUserService', '$window', '$filter', function($scope, $log, $timeout, QuotesService, $http, PredixUserService, $window, $filter) {
        $scope.QuotesList = [];
        $scope.userRole = $window.sessionStorage.getItem('roleName');
        if ($window.sessionStorage.getItem('auth_token')) {
            QuotesService.getQuotesList().then(function success(response) {
                console.log(response.data);
                angular.forEach(response.data, function(val, ind) {
                  angular.forEach(val.quotes, function(value, key) {
                    if($scope.userRole == 'ge-sales'){
                        if(value.status == 'rejected'){
                          $scope.QuotesList.push({
                              "quote#": value.status != 'confirmed' ? "<a id='quote' href='/quoteDetails/AR/"+ val.custId + "/" + value.quote_number + "'>" + value.quote_number + "</a>" : "<a href='/quoteDetails/AR/" + val.custId + "/" + value.quote_number + "'>" + value.quote_number + "</a>",
                              "quoteVer": value.quote_version,
                              "createdDate": value.quote_date ? $filter('date')(new Date(parseInt(value.quote_date) * 1000), 'MMM dd, yyyy') : '',
                              "status": value.status === "accepted" ? "<div class='status_accept'></div>" + value.status : value.status === "rejected" ? "<div class='status_reject'></div>" + value.status: "<div class='status_pending'></div>" + value.status,
                              "action": value.status == 'confirmed' ? "<a title='Accept Quote' style='color:Green !important' href='/quoteDetails/" + value.quote_number + "'><i class='fa fa-check' aria-hidden='true'></i></a>" : ""
                          });
                        }
                    }
                  });
                })
            });
        }
    }]);
});
