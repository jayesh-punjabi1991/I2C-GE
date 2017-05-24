define(['angular', './module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('CRDetailsCtrl', ['$scope', '$log','$timeout','CrService','$http','PredixUserService','$window','$state','$stateParams', function ($scope, $log,$timeout,CrService,$http,PredixUserService,$window, $state, $stateParams) {
      $scope.ChangeRequestList=[];
      $scope.OrderList=[];
      $scope.SubOrderList=[];
      $scope.crId = $stateParams.id;
      $scope.customerId = $stateParams.custId;
      var count=0;
      var count1=0;
      CrService.getCrDetails($stateParams.id, $stateParams.custId).then(function success(response){
        console.log(response);
        $scope.response=response;
        $scope.crData = response.data;
        $scope.orderNumber=response.data.ge_order_number;
        $scope.crdate=response.data.cr_date*1000;
        $scope.POnumber=response.data.order.cust_po_number;
        $scope.CRStatus=response.data.status;
        $scope.orderStatus = response.data.order.order_process_status;
        $scope.taxableStatus=response.data.order.taxable_status;
        $scope.deliveryTerms = response.data.order.delivery_terms;
        $scope.description = response.data.description;
        $scope.billingTimeline = response.data.order.sub_orders[0].billing_terms;
        $scope.billingTerms = response.data.order.sub_orders[0].payment_terms;
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
      $scope.acceptClicked=function(){
        // var d = document.getElementById("AcceptButton");
        // var d1 = document.getElementById("RejectButton");
        // d.className += " disabled";
        // d1.className += " disabled";

        var crdata = {
          'from' : $scope.crData.from
          ,'to' : $scope.crData.to
          ,'cc' : $scope.crData.cc
          ,'subject' : $scope.crData.subject
          ,'description' : $scope.crData.description
          ,'ge_order_number' :   $scope.crData.ge_order_number
          ,'cust_po_number' : $scope.crData.cust_po_number
          ,'sub_order_id' : $scope.crData.sub_order_id
          ,'contract_amount': $scope.crData.contract_amount
          ,'change_req_id': $scope.crData.change_req_id
          ,'cr_date': $scope.crData.cr_date
          ,'dispute_ref': $scope.crData.dispute_ref
          ,'order_date': $scope.crData.order_date
          ,'parentCustId': $scope.crData.parentCustId
          ,'status': $scope.crData.status
          ,'supporting_documents': $scope.crData.supporting_documents
        };

        CrService.acceptCR($scope.crData.change_req_id, $scope.customerId, crdata).success(function (response) {
          alert('success!');
        })

        //console.log($scope.data);
      }

      $scope.rejectClicked=function(){
        // var d = document.getElementById("AcceptButton");
        // var d1 = document.getElementById("RejectButton");
        // d.className += " disabled";
        // d1.className += " disabled";

        var crdata = {
          'from' : $scope.crData.from
          ,'to' : $scope.crData.to
          ,'cc' : $scope.crData.cc
          ,'subject' : $scope.crData.subject
          ,'description' : $scope.crData.description
          ,'ge_order_number' :   $scope.crData.ge_order_number
          ,'cust_po_number' : $scope.crData.cust_po_number
          ,'sub_order_id' : $scope.crData.sub_order_id
          ,'contract_amount': $scope.crData.contract_amount
          ,'change_req_id': $scope.crData.change_req_id
          ,'cr_date': $scope.crData.cr_date
          ,'dispute_ref': $scope.crData.dispute_ref
          ,'order_date': $scope.crData.order_date
          ,'parentCustId': $scope.crData.parentCustId
          ,'status': $scope.crData.status
          ,'supporting_documents': $scope.crData.supporting_documents
        };

        // var crd = new FormData();
        // crd.append('file', '');
        // crd.append('crbody', JSON.stringify(crdata));
        CrService.rejectCR($scope.crData.change_req_id, $scope.customerId, crdata).success(function (response) {
          alert('success!');
        });
      }
      $scope.approveClicked=function(){
        var orderData = $scope.crData.order;

        // var crd = new FormData();
        // crd.append('file', '');
        // crd.append('crbody', JSON.stringify(crdata));
        console.log(orderData);
        CrService.approveOrder($scope.orderNumber, $scope.customerId, orderData).success(function (response) {
          alert('success!');
        });
      }

    }]);
});
