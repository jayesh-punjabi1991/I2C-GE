define(['angular', './module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('OrderCtrl', ['$scope','OrdersService','$http','PredixUserService','$window', function ($scope,OrdersService,$http,PredixUserService,$window) {
      $scope.OrdersList=[];
      if($window.sessionStorage.getItem('auth_token')){
        OrdersService.getOrdersList().then(function success(response){
          angular.forEach(response.data,function(value,key){
            $scope.OrdersList.push({"order#":value.status== 'Accepted' ? "<a id='quote' href='/orderDetails/"+value.ge_order_number+ "'>"+value.ge_order_number+"</a>" : "<a href='/orderDetails/"+value.ge_order_number+"'>"+value.ge_order_number+"</a>","PO#":value.customer_po_number,"createdDate":value.order_date,"status":value.status,"action":value.status=='Accepted' ? "<a title='Accept Quote' style='color:Green !important' href='/orderDetails'><i class='fa fa-thumbs-up' aria-hidden='true'></i></a>" : "", "value": value.contract_amount });
          });
        });
      }
    }]);
});
