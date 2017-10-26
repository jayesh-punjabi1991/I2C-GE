define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('DisputeCtrl', ['$scope', 'DisputeService', '$http', '$timeout','PredixUserService', '$window', '$filter', function($scope, DisputeService, $http, $timeout,PredixUserService, $window, $filter) {

        $scope.DisputeList = [];
        $scope.Loading=true;

        if ($window.sessionStorage.getItem('auth_token')) {
            DisputeService.getDisputesList().then(function success(response) {
              $scope.GetDisputes(response);
              $scope.Loading=false;
            });
        }
        

        window.sortbydate= function(a, b) {
          if(this.descending) {
            if(new Date(a.value) < new Date(b.value)) {
              return 1;
            }
            return -1;
          }
          else {
            if(new Date(a.value) > new Date(b.value)) {
              return 1;
            }
            return -1;
          }
        }
        window.sortbyDisputeNumber=function(a,b){
          if(this.descending) {
            if(parseInt(a.value.substr(a.value.indexOf('>')+1,a.value.indexOf('</a>')-a.value.indexOf('>')+1)) < parseInt(b.value.substr(b.value.indexOf('>')+1,b.value.indexOf('</a>')-b.value.indexOf('>')+1))){
              return 1;
            }
            return -1;
          }
          else {
            if(parseInt(a.value.substr(a.value.indexOf('>')+1,a.value.indexOf('</a>')-a.value.indexOf('>')+1)) > parseInt(b.value.substr(b.value.indexOf('>')+1,b.value.indexOf('</a>')-b.value.indexOf('>')+1))) {
              return 1;
            }
            return -1;
          }
        }
        $scope.GetDisputes=function(valuedata){
          $scope.DisputeList = [];
          angular.forEach(valuedata.data, function(val, ind) {
              angular.forEach(val.disputes, function(value, key) {
                  $scope.DisputeList.push({
                    "Dispute#":"<a href='/disputeDetails/"+val.custId+"/"+value.dispute_id+"'>"+value.dispute_id+"</a>",
                    "order#":value.ge_order_number,
                    "Invoice#":value.invoice_number,
                    "DisputeDate":value.dispute_date ? $filter('date')(value.dispute_date * 1000, "MMM dd, yyyy") : '',
                    "status":value.status,
                    "custId":val.custId,
                    "dispute_date":value.dispute_date
                  });
              })
          });
          $scope.DisputeList=$filter("orderBy")($scope.DisputeList,"dispute_date");
        }

                $timeout(function() {

                    document.getElementById('Cancel').addEventListener("click", ResetData);

                    function ResetData() {
                        $scope.Loading = true;
                        DisputeService.getDisputesList().then(function success(response) {
                            console.log(response.data);
                            $scope.Loading = false;
                            $scope.GetDisputes(response);
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

                        DisputeService.getDisputesListByDate().then(function success(response) {
                            console.log(response.data);
                            $scope.Loading = false;
                            $scope.GetDisputes(response);
                        });

                    });
                }, 6000);

    }]);
});
