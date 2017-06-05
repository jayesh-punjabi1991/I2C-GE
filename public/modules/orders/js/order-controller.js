define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('OrderCtrl', ['$scope', 'OrdersService', '$http', '$timeout','PredixUserService', '$window', '$filter', function($scope, OrdersService, $http, $timeout,PredixUserService, $window, $filter) {
        $scope.OrderList = [];
        $scope.Loading=true;
        if ($window.sessionStorage.getItem('auth_token')) {
            OrdersService.getOrdersList().then(function success(response) {
              $scope.GetOrders(response);
              $scope.Loading=false;
            });
        }

        $scope.GetOrders=function(valuedata){
          $scope.OrderList = [];
          angular.forEach(valuedata.data, function(val, ind) {
              angular.forEach(val.orders, function(value, key) {
                  $scope.OrderList.push({
                      "order#": value.order_process_status == 'accepted' ? "<a href='/orderDetails/Accepted/" + val.custId + "/" + value.ge_order_number + "'>" + value.ge_order_number + "</a>" : value.order_process_status == 'generated' ? "<a href='/orderDetails/Accepted/" + val.custId + "/" + value.ge_order_number + "'>" + value.ge_order_number + "</a>" : value.order_process_status == 'change_requested' ? "<a href='/orderDetails/CR/" + val.custId + "/" + value.ge_order_number + "'>" + value.ge_order_number + "</a>" : "<a href='/orderDetails/Rejected/" + val.custId + "/" + value.ge_order_number + "'>" + value.ge_order_number + "</a>",
                      "PO#": value.cust_po_number,
                      "createdDate": value.order_date ? $filter('date')(new Date(parseInt(value.order_date) * 1000), 'MMM dd, yyyy') : '',
                      "value": $filter('currency')(value.contract_amount, 'USD ', 2),
                      "status": value.order_process_status === "accepted" ? "<div class='status_accept'></div>" + value.order_process_status : value.order_process_status === "rejected" ? "<div class='status_reject'></div>" + value.order_process_status : "<div class='status_pending'></div>" + value.order_process_status,
                      "action": value.order_process_status == 'accepted' ? "<a title='Raise a change Request' style='color:#2b5ea2 !important' href='/orderDetails/Accepted/"+val.custId+"/"+ value.ge_order_number + "'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></a>" : "",
                      "custNum": value.customer_number,
                      "custName": value.customer_name
                  });
              })
          });

        }

                $timeout(function() {

                    document.getElementById('Cancel').addEventListener("click", ResetData);

                    function ResetData() {
                        $scope.Loading = true;
                        OrdersService.getOrdersList().then(function success(response) {
                            console.log(response.data);
                            $scope.Loading = false;
                            $scope.GetOrders(response);
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

                        OrdersService.getOrdersListByDate().then(function success(response) {
                          debugger
                            console.log(response.data);
                            $scope.Loading = false;
                            $scope.GetOrders(response);
                        });

                    });
                }, 6000);

    }]);
});
