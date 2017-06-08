define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('OrderDetailsCtrl', ['$scope', '$log', 'PredixAssetService', 'PredixViewService', '$timeout', 'OrdersService', '$http', '$state', '$stateParams','$window','$filter', function($scope, $log, PredixAssetService, PredixViewService, $timeout, OrdersService, $http, $state, $stateParams, $window, $filter) {

        $scope.OrderList = [];
        $scope.SubOrderList = [];
        $scope.ShipmentList = [];
        $scope.dummy = [];
        $scope.Suborder = false;
        $scope.Shipment = false;
        var count = 0;
        var count1 = 0;
        $scope.customerId = $stateParams.custId;
        $scope.orderNumber = $stateParams.id;
        //Service Call
        OrdersService.getOrderDetails($stateParams.id, $stateParams.custId).then(function success(response) {
            console.log(response);
            $scope.response = response;
            $scope.orderdate = parseInt(response.data.order_date * 1000);
            $scope.POnumber = response.data.cust_po_number;
            $scope.status = response.data.order_process_status;
            $scope.quoteNumber = response.data.quote_number;
            $scope.taxableStatus = response.data.taxable_status;
            $scope.liquidatedDamageTerms = response.data.liquidated_damage_terms;
            $scope.billingTerms = response.data.sub_orders[0].payment_terms;
            $scope.deliveryTerms = response.data.delivery_terms;
            $scope.customerNumber = response.data.customer_number;
            $scope.customerName = response.data.customer_name;
            $scope.contractAmount = response.data.contract_amount;
            $scope.shipTo_1 = ($scope.response.data.sub_orders[0].shipments[0].ship_to.address1 ? $scope.response.data.sub_orders[0].shipments[0].ship_to.address1 : '');
            $scope.shipTo_2 = ($scope.response.data.sub_orders[0].shipments[0].ship_to.address2 ? $scope.response.data.sub_orders[0].shipments[0].ship_to.address2 : '');
            $scope.shipTo_3 = ($scope.response.data.sub_orders[0].shipments[0].ship_to.address3 ? $scope.response.data.sub_orders[0].shipments[0].ship_to.address3 : '');
            $scope.shipTo_4 = ($scope.response.data.sub_orders[0].shipments[0].ship_to.city ? $scope.response.data.sub_orders[0].shipments[0].ship_to.city : '');
            $scope.shipTo_5 = ($scope.response.data.sub_orders[0].shipments[0].ship_to.country ? $scope.response.data.sub_orders[0].shipments[0].ship_to.country : '');
            $scope.shipTo_6 = ($scope.response.data.sub_orders[0].shipments[0].ship_to.postalcode ? $scope.response.data.sub_orders[0].shipments[0].ship_to.postalcode : '');
            $scope.shipTo_7 = ($scope.response.data.sub_orders[0].shipments[0].ship_to.province ? $scope.response.data.sub_orders[0].shipments[0].ship_to.province : '');
            $scope.shipTo_8 = ($scope.response.data.sub_orders[0].shipments[0].ship_to.state ? $scope.response.data.sub_orders[0].shipments[0].ship_to.state : '');
            $scope.billTo_1 = $scope.response.data.sub_orders[0].bill_to.address1 ? " " + $scope.response.data.sub_orders[0].bill_to.address1 : '';
            $scope.billTo_2 = $scope.response.data.sub_orders[0].bill_to.address2 ? " " + $scope.response.data.sub_orders[0].bill_to.address2 : '';
            $scope.billTo_3 = $scope.response.data.sub_orders[0].bill_to.address3 ? " " + $scope.response.data.sub_orders[0].bill_to.address3 : '';
            $scope.billTo_4 = ($scope.response.data.sub_orders[0].bill_to.city) ? " " + $scope.response.data.sub_orders[0].bill_to.city : '';
            $scope.billTo_5 = ($scope.response.data.sub_orders[0].bill_to.country) ? " " + $scope.response.data.sub_orders[0].bill_to.country : '';
            $scope.billTo_6 = ($scope.response.data.sub_orders[0].bill_to.postalcode) ? " " + $scope.response.data.sub_orders[0].bill_to.postalcode : '';
            $scope.billTo_7 = ($scope.response.data.sub_orders[0].bill_to.province) ? " " + $scope.response.data.sub_orders[0].bill_to.province : '';
            $scope.billTo_8 = ($scope.response.data.sub_orders[0].bill_to.state) ? " " + $scope.response.data.sub_orders[0].bill_to.state : '';
            $scope.bill_to = $scope.billTo_1 + $scope.billTo_2 + $scope.billTo_3 + $scope.billTo_4 + $scope.billTo_5 + $scope.billTo_6 + $scope.billTo_7 + $scope.billTo_8;
            $scope.shipTo = $scope.response.data.sub_orders[0].shipments[0].ship_to;
            $scope.billingTimeline = response.data.sub_orders[0].billing_terms;
            $scope.currency = $scope.currency;
            $scope.order_ff_state = response.data.order_ff_state;
            if(response.data.supporting_documents != null && response.data.supporting_documents.length != 0){
                $scope.docFlag = true;
                $scope.supporting_documents = response.data.supporting_documents;
            }else{
                $scope.docFlag = false;
            }
            $scope.subject = "Request for change on Order " + $scope.orderNumber;
            $scope.subOrders = [];
            //For Sub-Order Table
            angular.forEach(response.data.sub_orders, function(value, key) {
                $scope.subOrders[key] = value.sub_order_id;
                $scope.OrderList[count] = value;
                $scope.OrderList[count].SrNo = count + 1;
                $scope.billTo_9 = $scope.response.data.sub_orders[0].bill_to.address1 ? " " + $scope.response.data.sub_orders[0].bill_to.address1 : '';
                $scope.billTo_10 = $scope.response.data.sub_orders[0].bill_to.address2 ? " " + $scope.response.data.sub_orders[0].bill_to.address2 : '';
                $scope.billTo_11 = $scope.response.data.sub_orders[0].bill_to.address3 ? " " + $scope.response.data.sub_orders[0].bill_to.address3 : '';
                $scope.billTo_12 = ($scope.response.data.sub_orders[0].bill_to.city) ? " " + $scope.response.data.sub_orders[0].bill_to.city : '';
                $scope.billTo_13 = ($scope.response.data.sub_orders[0].bill_to.country) ? " " + $scope.response.data.sub_orders[0].bill_to.country : '';
                $scope.billTo_14 = ($scope.response.data.sub_orders[0].bill_to.postalcode) ? " " + $scope.response.data.sub_orders[0].bill_to.postalcode : '';
                $scope.billTo_15 = ($scope.response.data.sub_orders[0].bill_to.province) ? " " + $scope.response.data.sub_orders[0].bill_to.province : '';
                $scope.billTo_16 = ($scope.response.data.sub_orders[0].bill_to.state) ? " " + $scope.response.data.sub_orders[0].bill_to.state : '';
                $scope.bill_to = $scope.billTo_9 + $scope.billTo_10 + $scope.billTo_11 + $scope.billTo_12 + $scope.billTo_13 + $scope.billTo_14 + $scope.billTo_15 + $scope.billTo_16;
                $scope.OrderList[count].billToaddress = $scope.bill_to;
                $scope.OrderList[count].shipToaddress = $scope.shipTo_1 + ' ' + $scope.shipTo_2 + ' ' + $scope.shipTo_3 + ' ' + $scope.shipTo_4;
                $scope.OrderList[count].link = "<a id='Detail" + value.sub_order_id + "' class=" + value.sub_order_id + " href='javascript:void(0)'>Details</a>";
                $scope.OrderList[count].ros_date = $filter('date')(new Date(value.ros_date * 1000), 'MMM dd, yyyy');
                $scope.OrderList[count].sch_date = $filter('date')(new Date(value.sch_date * 1000), 'MMM dd, yyyy');
                $scope.OrderList[count].ship_date = $filter('date')(new Date(value.ship_date * 1000), 'MMM dd, yyyy');
                $scope.OrderList[count].delivery_date = $filter('date')(new Date(value.delivery_date * 1000), 'MMM dd, yyyy');
                $scope.OrderList[count].billing_amount = $filter('currency')(value.billing_amount, 'USD ', 2);
                count++;
            })
            $scope.LengthOfOrders=$scope.OrderList.length;
            //For Shipment Table
            $timeout(function() {
                for (var i = 0; i < $scope.response.data.sub_orders.length; i++) {
                    document.getElementById('Detail' + $scope.response.data.sub_orders[i].sub_order_id).addEventListener('click', function(event) {
                        $scope.dummy=[];
                        var count1 = 0;
                        $scope.SubOrderList = [];
                        $scope.ShipmentList=[];
                        $scope.Shipment=false;
                        $scope.$apply();
                        $scope.selectedSubOrder = event.target.className;
                        for (var i = 0; i < $scope.response.data.sub_orders.length; i++) {
                            angular.forEach($scope.response.data.sub_orders[i].shipments, function(value, key) {
                                if (value.sub_order_id == $scope.selectedSubOrder) {
                                    $scope.dummy.push({
                                        'ge_order_number': value.ge_order_number,
                                        'ship_to': value.ship_to,
                                        'shipment_id': value.shipment_id,
                                        'sub_order_id': value.sub_order_id,
                                        'ship_date': $filter('date')(new Date(value.ship_date * 1000), 'MMM dd, yyyy'),
                                        'delivery_date': $filter('date')(new Date(value.delivery_date * 1000), 'MMM dd, yyyy'),
                                        'shipment_ff_state': value.shipment_ff_state
                                    });
                                    $scope.SubOrderList[count1] = $scope.dummy[count1];
                                    $scope.SubOrderList[count1].SrNo = count1 + 1;
                                    $scope.SubOrderList[count1].link = "<a id='Details" + $scope.dummy[count1].shipment_id + "' class=" + $scope.dummy[count1].shipment_id + " href='javascript:void(0)'>Details</a>";
                                    $scope.SubOrderList[count1].ship_to=$scope.dummy[count1].ship_to.address1 ? $scope.dummy[count1].ship_to.address1 : '' + " " + $scope.dummy[count1].ship_to.address2 ? $scope.dummy[count1].ship_to.address2 : '' + " " + $scope.dummy[count1].ship_to.city ? $scope.dummy[count1].ship_to.city : '' + " " + $scope.dummy[count1].ship_to.country ? $scope.dummy[count1].ship_to.country : '' + " " + $scope.dummy[count1].ship_to.state ? $scope.dummy[count1].ship_to.state : '' + " " + $scope.dummy[count1].ship_to.province ? $scope.dummy[count1].ship_to.province : '' + " " + $scope.dummy[count1].ship_to.postalcode ? $scope.dummy[count1].ship_to.postalcode : '';
                                    ++count1;
                                }
                            })
                        }
                        //debugger
                        $scope.LengthOfSubOrders=$scope.SubOrderList.length;
                        $scope.CreateShipmentJson();
                        if ($scope.SubOrderList.length > 0) {
                            $scope.Suborder = true;
                            $scope.$apply();
                        } else {
                            $scope.Suborder = false;
                            $scope.$apply();
                        }
                    }, false);
                }

            }, 1000);
            //For Shipment Table
            $scope.CreateShipmentJson = function() {
                $timeout(function() {
                    for (var i = 0; i < $scope.SubOrderList.length; i++) {
                      $scope.selectedShipment = event.target.className;
                      var count2 = 0;
                      $scope.ShipmentList = [];
                      angular.forEach($scope.response.data.order_lines, function(value, key) {
                          if (value.shipment_id == $scope.selectedShipment) {
                              $scope.ShipmentList[count2] = value;
                              $scope.ShipmentList[count2].SrNo = count2 + 1;
                              $scope.ShipmentList[count2].sellingPrice = $filter('currency')($scope.ShipmentList[count2].list_price - ($scope.ShipmentList[count2].list_price * ($scope.ShipmentList[count2].discount_perc / 100)), 'USD ', 2);
                              $scope.ShipmentList[count2].list_price = $filter('currency')($scope.ShipmentList[count2].list_price, 'USD ', 2);
                              $scope.ShipmentList[count2].discount_perc = $filter('number')($scope.ShipmentList[count2].discount_perc, 0);
                                        count2++;
                                    }
                                })
                                $scope.LengthOfShipment = $scope.ShipmentList.length;
                                if ($scope.ShipmentList.length > 0) {
                                    $scope.Shipment = true;
                                    $scope.$apply();
                                } else {
                                    $scope.Shipment = false;
                                    $scope.$apply();
                                }

                        }
                }, 3000);
            }
        })

        $scope.editIconClicked = function() {
            $scope.changeRequest = true;
        };
        $(document).ready(function() {
            $("#CR").click(function() {
                $("#changeRequestDiv").slideToggle("slow");
            });
        });

        OrdersService.getDLforCR($scope.customerId).then(function success(response) {
          $scope.to=response.data.to;
        });

        $scope.sendCRMail = function () {
          var mail = {
            'from' : $window.sessionStorage.getItem('userEmail')
            ,'to' : $scope.to
            ,'cc' : $scope.cc
            ,'subject' : $scope.subject
            ,'description' : $scope.description
            ,'ge_order_number' :   $scope.orderNumber
            ,'cust_po_number' : $scope.POnumber
            ,'sub_order_id' : $scope.sub_order_id
          }
          console.log(mail);
          var fd = new FormData();
          fd.append('crbody', JSON.stringify(mail));
          angular.forEach($scope.files, function(file){
             fd.append('file', file);
          });
          // for (var pair in fd.entries()) {
          //     console.log(pair[0]+ ', ' + pair[1]);
          // };
          OrdersService.initiateCR($scope.orderNumber,$scope.customerId, fd).success(function (response) {
            alert('Change Request has been created');
            $state.reload();
          })
        }

        $scope.displayFile = function (fileName) {
          QuotesService.viewDocument(fileName).success(function(response){
               var sliceSize = sliceSize || 512;

               var byteCharacters = atob(response);
               var byteArrays = [];

               for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                  byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
               }
               var blob = new Blob(byteArrays, { type: 'application/pdf' });
               var objectUrl = URL.createObjectURL(blob);
               //console.log(objectUrl);
               //var fURL = $sce.trustAsResourceUrl(objectUrl);
               window.open(objectUrl);
          });
        }

    }]);
});
