define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('QuotesCtrl', ['$scope', '$log', '$timeout', 'QuotesService', '$http', 'PredixUserService', '$window', '$filter', function($scope, $log, $timeout, QuotesService, $http, PredixUserService, $window, $filter) {
        $scope.QuotesList = [];
        $scope.Loading=true;
        $scope.userRole = $window.sessionStorage.getItem('roleName');
        if ($window.sessionStorage.getItem('auth_token')) {
            QuotesService.getQuotesList().then(function success(response) {
                $scope.GetQuotes(response);
                $scope.Loading=false;
            });
        }
        $scope.GetQuotes=function(valuedata){
          console.log(valuedata.data);
          angular.forEach(valuedata.data, function(val, ind) {
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
        }
        $timeout(function() {

            document.getElementById('Cancel').addEventListener("click", ResetData);

            function ResetData() {
                $scope.Loading = true;
                QuotesService.getQuotesList().then(function success(response) {
                    console.log(response.data);
                    $scope.Loading = false;
                    $scope.GetQuotes(response);
                });
            }

            document.getElementById('rangePicker').addEventListener('px-datetime-range-submitted', function(e) {
                $scope.Loading = true;
                var fromDate1 = e.detail.range.from.split('T')[0];
                var toDate1 = e.detail.range.to.split('T')[0];

                function ConvertDate(val) {
                    var d = new Date(val);
                    var n = d.getFullYear();
                    var n1 = d.getMonth();
                    n1 = parseInt(n1);
                    n1 = n1 + 1;
                    n1 = n1.toString();
                    if (n1 <= 9)
                        n1 = '0' + n1;
                    var n2 = d.getDate();
                    if (n2 <= 9)
                        n2 = '0' + n2;
                    return n2 + "-" + n1 + "-" + n;
                }

                var fromDate = ConvertDate(fromDate1);
                var toDate = ConvertDate(toDate1);

                $window.sessionStorage.setItem('fromDate', fromDate);
                $window.sessionStorage.setItem('toDate', toDate);

                QuotesService.getQuotesListByDate().then(function success(response) {
                    console.log(response.data);
                    $scope.Loading = false;
                    $scope.GetQuotes(response);
                });

            });
        }, 6000);

    }]);
});
