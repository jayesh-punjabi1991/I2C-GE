define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('OrderCtrl', ['$scope', 'OrdersService', '$http', '$timeout','PredixUserService', '$window', '$filter', function($scope, OrdersService, $http, $timeout,PredixUserService, $window, $filter) {
        $scope.OrderList = [];
        $scope.OrderRequestListAccepted = [];
        $scope.OrderRequestListNotAccepted = [];
        $scope.Loading=true;
        if ($window.sessionStorage.getItem('auth_token')) {
            OrdersService.getOrdersList().then(function success(response) {
              $scope.GetOrders(response);
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
        $scope.GetOrders=function(valuedata){
          $scope.OrderList = [];
          angular.forEach(valuedata.data, function(val, ind) {
              angular.forEach(val.orders, function(value, key) {
                  $scope.OrderList.push({
                      "order#": value.order_process_status == 'accepted' ? "<a href='/orderDetails/" + val.custId + "/" + value.ge_order_number + "'>" + value.ge_order_number + "</a>" : value.order_process_status == 'generated' ? "<a href='/orderDetails/" + val.custId + "/" + value.ge_order_number + "'>" + value.ge_order_number + "</a>" : value.order_process_status == 'change_requested' ? "<a href='/orderDetails/" + val.custId + "/" + value.ge_order_number + "'>" + value.ge_order_number + "</a>" : "<a href='/orderDetails/" + val.custId + "/" + value.ge_order_number + "'>" + value.ge_order_number + "</a>",
                      "PO#": value.cust_po_number,
                      "createdDate": value.order_date ? $filter('date')(new Date(parseInt(value.order_date) * 1000), 'MMM dd, yyyy') : '',
                      "value": $filter('currency')(value.contract_amount, 'USD ', 2),
                      "status": value.order_process_status === "accepted" ? "<div class='status_accept'></div>" + value.order_process_status : value.order_process_status === "rejected" ? "<div class='status_reject'></div>" + value.order_process_status : "<div class='status_pending'></div>" + value.order_process_status,
                      "action": value.order_process_status == 'accepted' ? "<a title='Raise a change Request' style='color:#2b5ea2 !important' href='/orderDetails/Accepted/"+val.custId+"/"+ value.ge_order_number + "'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></a>" : "",
                      "custId": val.custId,
                      "order_date":value.order_date,
                      "actualstatus":value.order_process_status
                  });
              })
          });
          $scope.SortData();
        }

        $scope.SortData=function(){
            //Active CR's sorted by date
            angular.forEach($scope.OrderList,function(v,k){
              if(v.actualstatus=="accepted"){
                $scope.OrderRequestListAccepted.push(v);
              }
            })
            $scope.OrderRequestListAccepted=$filter("orderBy")($scope.OrderRequestListAccepted,"order_date");

            //Non Active CR's sorted by date
            angular.forEach($scope.OrderList,function(v,k){
              if(v.actualstatus!="accepted"){
                $scope.OrderRequestListNotAccepted.push(v);
              }
            })
            $scope.OrderRequestListNotAccepted=$filter("orderBy")($scope.OrderRequestListNotAccepted,"order_date");

            //Pushing Active and Non Active CR's in sorted order together
            $scope.OrderList=[];
            angular.forEach($scope.OrderRequestListAccepted,function(value,key){
              $scope.OrderList.push(value);
            })
            angular.forEach($scope.OrderRequestListNotAccepted,function(value,key){
              $scope.OrderList.push(value);
            })
            $scope.Length = $scope.OrderList.length;
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
