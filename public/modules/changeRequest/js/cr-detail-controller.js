define(['angular', './module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('CRDetailsCtrl', ['$scope', '$log','$timeout','CrService','$http','PredixUserService','$window','$state','$stateParams', function ($scope, $log,$timeout,CrService,$http,PredixUserService,$window, $state, $stateParams) {
      $scope.ChangeRequestList=[];
      $scope.OrderList=[];
      $scope.SubOrderList=[];
      $scope.crId = $stateParams.id;
      var count=0;
      var count1=0;
      CrService.getCrDetails($stateParams.id, $stateParams.custId).then(function success(response){
        console.log(response);
        $scope.response=response;
        $scope.crData = response.data;
        $scope.orderNumber=response.data.ge_order_number;
        $scope.orderdate=response.data.cr_date*1000;
        $scope.POnumber=response.data.order.cust_po_number;
        $scope.CRStatus=response.data.status;
        $scope.taxableStatus=response.data.order.taxable_status;
        $scope.description = response.data.description;
        $scope.liquidatedDamageTerms=response.data.order.liquidated_damage_terms;
        $scope.shipTo_1 = ($scope.response.data.order.sub_orders[0].shipments[0].ship_to.address1 ? $scope.response.data.order.sub_orders[0].shipments[0].ship_to.address1 : '');
        $scope.shipTo_2 = ($scope.response.data.order.sub_orders[0].shipments[0].ship_to.address2 ? $scope.response.data.order.sub_orders[0].shipments[0].ship_to.address2 : '');
        $scope.shipTo_3 = ($scope.response.data.order.sub_orders[0].shipments[0].ship_to.city ? $scope.response.data.order.sub_orders[0].shipments[0].ship_to.city : '')  + " " + ($scope.response.data.order.sub_orders[0].shipments[0].ship_to.country ? $scope.response.data.order.sub_orders[0].shipments[0].ship_to.country : '');
        $scope.shipTo_4 = $scope.response.data.order.sub_orders[0].shipments[0].ship_to.state ? $scope.response.data.order.sub_orders[0].shipments[0].ship_to.state : '' + " " + $scope.response.data.order.sub_orders[0].shipments[0].ship_to.province ? $scope.response.data.order.sub_orders[0].shipments[0].ship_to.province : '' + " " + $scope.response.data.order.sub_orders[0].shipments[0].ship_to.postalcode ? $scope.response.data.order.sub_orders[0].shipments[0].ship_to.postalcode : '';
        $scope.billTo_1 = $scope.response.data.order.sub_orders[0].bill_to.address1 ? $scope.response.data.order.sub_orders[0].bill_to.address1 : '';
        $scope.billTo_2 = $scope.response.data.order.sub_orders[0].bill_to.address2 ? $scope.response.data.order.sub_orders[0].bill_to.address2 : '';
        $scope.billTo_3 = ($scope.response.data.order.sub_orders[0].bill_to.city)?$scope.response.data.order.sub_orders[0].bill_to.city:'' + " " + ($scope.response.data.order.sub_orders[0].bill_to.country)?$scope.response.data.order.sub_orders[0].bill_to.country:'';
        $scope.billTo_4 = ($scope.response.data.order.sub_orders[0].bill_to.state)?$scope.response.data.order.sub_orders[0].bill_to.state:'' + " " + ($scope.response.data.order.sub_orders[0].bill_to.province)?$scope.response.data.order.sub_orders[0].bill_to.province:'' + " " + ($scope.response.data.order.sub_orders[0].postalcode)?$scope.response.data.order.sub_orders[0].postalcode:'';
        //For Sub-Order Table
        angular.forEach(response.data.order.sub_orders,function(value,key){
          $scope.OrderList[count]=value;
          $scope.OrderList[count].SrNo=count+1;
          $scope.OrderList[count].billToaddress=value.bill_to.address1 ? value.bill_to.address1 : ''+" "+value.bill_to.address2 ? value.bill_to.address2 : ''+" " +value.bill_to.city ? value.bill_to.city :''+" "+value.bill_to.country ? value.bill_to.country : ''+" "+value.bill_to.state ? value.bill_to.state : ''+" "+value.bill_to.province ? value.bill_to.province : ''+" "+value.bill_to.postalcode ? value.bill_to.postalcode : '';
          $scope.OrderList[count].link="<a id='Detail"+value.sub_order_id+"' class="+value.sub_order_id+" href='javascript:void(0)'>Details</a>";
          count++;
        })

        //For Shipment Table
        $timeout(function () {
          debugger
          for(var i=0;i<$scope.response.data.order.sub_orders.length;i++){
          document.getElementById('Detail'+$scope.response.data.order.sub_orders[i].sub_order_id).addEventListener('click', function(event) {
            var count1=0;
            $scope.SubOrderList=[];
            $scope.selectedSubOrder=event.target.className;
            for(var i=0;i<$scope.response.data.order.sub_orders.length;i++){
            angular.forEach($scope.response.data.order.sub_orders[i].shipments,function(value,key){
              if(value.sub_order_id==$scope.selectedSubOrder){
                $scope.SubOrderList[count1]=value;
                $scope.SubOrderList[count1].SrNo=count1+1;
                $scope.SubOrderList[count1].link="<a href='javascript:void(0)'>Details</a>";
                $scope.SubOrderList[count1].ship_to=value.ship_to.address1 ? value.ship_to.address1 : '' + " " + value.ship_to.address2 ? value.ship_to.address2 : '' + " " + value.ship_to.city ? value.ship_to.city : '' + " " + value.ship_to.country ? value.ship_to.country : '' + " " + value.ship_to.state ? value.ship_to.state : '' + " " + value.ship_to.province ? value.ship_to.province : '' + " " + value.ship_to.postalcode ? value.ship_to.postalcode : '';
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
      $scope.AcceptClicked=function(){
        var d = document.getElementById("AcceptButton");
        var d1 = document.getElementById("RejectButton");
        d.className += " disabled";
        d1.className += " disabled";
      }

      $scope.RejectClicked=function(){
        var d = document.getElementById("AcceptButton");
        var d1 = document.getElementById("RejectButton");
        d.className += " disabled";
        d1.className += " disabled";
      }

    }]);
});
