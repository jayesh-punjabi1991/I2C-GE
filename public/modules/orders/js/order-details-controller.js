define(['angular', './module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('OrderDetailsCtrl', ['$scope','OrdersService','$http','$state','$stateParams','$timeout', function ($scope,OrdersService,$http,$state,$stateParams,$timeout) {
      $scope.OrderList=[];
      $scope.SubOrderList=[];
      $scope.Suborder=false;
      var count=0;
      var count1=0;

      OrdersService.getOrderDetails($stateParams.id).then(function success(response){
        //$scope.orderData = response.data;
        $scope.response=response;
        $scope.orderNumber=response.data.orderNumber;
        $scope.orderdate=new Date(response.data.order_date);
        $scope.POnumber=response.data.cust_po_number;
        $scope.status=response.data.status;
        $scope.taxableStatus=response.data.taxable_status;
        $scope.liquidatedDamageTerms=response.data.liquidated_damage_terms;
        $scope.billingTerms=response.data.billing_terms;
        $scope.deliveryTerms=response.data.delivery_terms;
        $scope.customerNumber=response.data.customer_number;
        $scope.contractAmount=response.data.contract_amount;
        //For Sub-Order Table
        angular.forEach(response.data.sub_orders,function(value,key){
          $scope.OrderList[count]=value;
          $scope.OrderList[count].SrNo=count+1;
          $scope.OrderList[count].billToaddress=value.bill_to.address1+" "+value.bill_to.address2+" " +value.bill_to.city+" "+value.bill_to.country+" "+value.bill_to.state+" "+value.bill_to.province+" "+value.bill_to.postalcode;
          $scope.OrderList[count].link="<a id='Detail"+value.sub_order_id+"' class="+value.sub_order_id+" href='javascript:void(0)'>Details</a>";
          count++;
        });

            //For Shipment Table
            $timeout(function () {
              for(var i=0;i<$scope.response.data.sub_orders.length;i++){
              document.getElementById('Detail'+$scope.response.data.sub_orders[i].sub_order_id).addEventListener('click', function(event) {
                var count1=0;
                $scope.SubOrderList=[];
                $scope.selectedSubOrder=event.target.className;
                for(var i=0;i<$scope.response.data.sub_orders.length;i++){
                angular.forEach($scope.response.data.sub_orders[i].shipments,function(value,key){
                  if(value.sub_order_id==$scope.selectedSubOrder){
                    $scope.SubOrderList[count1]=value;
                    $scope.SubOrderList[count1].SrNo=count1+1;
                    $scope.SubOrderList[count1].link="<a href='javascript:void(0)'>Details</a>";
                    ++count1;
                  }
                })
              }
                  if($scope.SubOrderList.length>0){
                  $scope.Suborder=true;
                  $scope.$apply();
                }
                else{
                  $scope.Suborder=false;
                }
            }, false);
          }
        }, 5000);
      })
    }]);
});
