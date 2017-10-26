define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('CRDetailsCtrl', ['$scope', '$log', '$timeout', 'CrService', '$http', 'PredixUserService', '$window', '$state', '$stateParams', '$filter', 'QuotesService', function($scope, $log, $timeout, CrService, $http, PredixUserService, $window, $state, $stateParams, $filter, QuotesService) {
        $scope.Message="Click Here to view Previous Version";
        $scope.MessageDisplay=true;
        $scope.Loading1 = true;
        $scope.Validation = false;
        $scope.Validation1 = false;
        $scope.Validation2 = false;
        $scope.Validation3 = false;
        $scope.ChangeRequestList = [];
        $scope.OrderList = [];
        $scope.SubOrderList = [];
        $scope.ShipmentList = [];
        $scope.dummy = [];
        $scope.dummy1 = [];
        $scope.crId = $stateParams.id;
        $scope.customerId = $stateParams.custId;
        $scope.orderStatus = '';
        $scope.Loading = false;
        $scope.CurrentVersion = true;
        $scope.acptBtn = false;
        $scope.showLinkInput = false;
        $scope.rejectBtn = false;
        $scope.showTextInput = false;
        var count = 0;
        var count1 = 0;
        CrService.getCrDetails($stateParams.id, $stateParams.custId).then(function success(response) {
            $scope.Loading1 = false;
            console.log(response);
            $scope.orderNumber = response.data.ge_order_number;

            $scope.response_o = response;
            $scope.crData = response.data;
            $scope.crdate = response.data.cr_date * 1000;
            $scope.POnumber = response.data.order.cust_po_number;
            $scope.CRStatus = response.data.status;
            $scope.orderStatus = response.data.order.order_process_status;
            $scope.taxableStatus = response.data.order.taxable_status;
            $scope.deliveryTerms = response.data.order.delivery_terms;
            $scope.description = response.data.description;
            $scope.customerNumber = response.data.order.customer_number;
            $scope.customerName = response.data.order.customer_name;
            $scope.billingTimeline = response.data.order.sub_orders[0].billing_terms;
            $scope.billingTerms = response.data.order.sub_orders[0].payment_terms;
            $scope.liquidatedDamageTerms = response.data.order.liquidated_damage_terms;
            $scope.contract_amount = response.data.order.contract_amount;
            $scope.shipTo_1 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.address1 ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.address1 : '');
            $scope.shipTo_2 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.address2 ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.address2 : '');
            $scope.shipTo_3 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.address3 ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.address3 : '');
            $scope.shipTo_4 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.city ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.city : '');
            $scope.shipTo_5 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.country ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.country : '');
            $scope.shipTo_6 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.postalcode ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.postalcode : '');
            $scope.shipTo_7 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.province ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.province : '');
            $scope.shipTo_8 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.state ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.state : '');
            $scope.billTo_1 = $scope.response_o.data.order.sub_orders[0].bill_to.address1 ? " " + $scope.response_o.data.order.sub_orders[0].bill_to.address1 : '';
            $scope.billTo_2 = $scope.response_o.data.order.sub_orders[0].bill_to.address2 ? " " + $scope.response_o.data.order.sub_orders[0].bill_to.address2 : '';
            $scope.billTo_3 = $scope.response_o.data.order.sub_orders[0].bill_to.address3 ? " " + $scope.response_o.data.order.sub_orders[0].bill_to.address3 : '';
            $scope.billTo_4 = ($scope.response_o.data.order.sub_orders[0].bill_to.city) ? " " + $scope.response_o.data.order.sub_orders[0].bill_to.city : '';
            $scope.billTo_5 = ($scope.response_o.data.order.sub_orders[0].bill_to.country) ? " " + $scope.response_o.data.order.sub_orders[0].bill_to.country : '';
            $scope.billTo_6 = ($scope.response_o.data.order.sub_orders[0].bill_to.postalcode) ? " " + $scope.response_o.data.order.sub_orders[0].bill_to.postalcode : '';
            $scope.billTo_7 = ($scope.response_o.data.order.sub_orders[0].bill_to.province) ? " " + $scope.response_o.data.order.sub_orders[0].bill_to.province : '';
            $scope.billTo_8 = ($scope.response_o.data.order.sub_orders[0].bill_to.state) ? " " + $scope.response_o.data.order.sub_orders[0].bill_to.state : '';
            $scope.bill_to = $scope.billTo_1 + $scope.billTo_2 + $scope.billTo_3 + $scope.billTo_4 + $scope.billTo_7 + $scope.billTo_8 + $scope.billTo_5 + $scope.billTo_6;
            $scope.order_ff_state = response.data.order.order_ff_state;
            if (response.data.supporting_documents != null && response.data.supporting_documents.length != 0) {
                $scope.docFlag = true;
                $scope.supporting_documents = response.data.supporting_documents;
            } else {
                $scope.docFlag = false;
            }

            //For Sub-Order Table
            $scope.OrderList = [];
            $scope.tempBillTo="";
            angular.forEach(response.data.order.sub_orders, function(value, key) {
              $scope.tempBillTo="";
            angular.forEach(value.bill_to, function(elm, key) {
              if(elm != null){
                //console.log(elm);
                $scope.tempBillTo = $scope.tempBillTo + ' ' + elm;
              }
            })

                $scope.OrderList[count] = value;
            $scope.OrderList[count].billToaddress = $scope.tempBillTo;
                $scope.OrderList[count].SrNo = count + 1;
                $scope.shipTo_1 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.address1 ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.address1 : '');
                $scope.shipTo_2 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.address2 ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.address2 : '');
                $scope.shipTo_3 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.address3 ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.address3 : '');
                $scope.shipTo_4 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.city ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.city : '');
                $scope.shipTo_5 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.country ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.country : '');
                $scope.shipTo_6 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.postalcode ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.postalcode : '');
                $scope.shipTo_7 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.province ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.province : '');
                $scope.shipTo_8 = ($scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.state ? $scope.response_o.data.order.sub_orders[0].shipments[0].ship_to.state : '');
                $scope.ship_to = $scope.shipTo_1 + $scope.shipTo_2 + $scope.shipTo_3 + $scope.shipTo_4 + $scope.shipTo_7 + $scope.shipTo_8 + $scope.shipTo_5 + $scope.shipTo_6;
                $scope.OrderList[count].shipToaddress = $scope.ship_to;
                $scope.OrderList[count].ros_date = value.ros_date ? $filter('date')(new Date(value.ros_date * 1000), 'MMM dd, yyyy') : '';

                $scope.OrderList[count].sch_date = value.sch_date ? $filter('date')(new Date(value.sch_date * 1000), 'MMM dd, yyyy') : '';
                $scope.OrderList[count].ship_date = value.ship_date ? $filter('date')(new Date(value.ship_date * 1000), 'MMM dd, yyyy') : '';
                console.log(value.delivery_date);
                $scope.OrderList[count].delivery_date = value.delivery_date ? $filter('date')(new Date(value.delivery_date * 1000), 'MMM dd, yyyy') : '';
                $scope.OrderList[count].billing_amount = $filter('currency')(value.billing_amount, 'USD ', 2);
                count++;
            })
            $scope.lengthofSubOrders = $scope.OrderList.length;
            //For Shipment Table
            $scope.CreateSubOrderJson1 = function() {
                //$timeout(function() {
                // console.log($scope.response.data);
                //for (var i = 0; i < $scope.response_o.data.order.sub_orders.length; i++) {
                //console.log($scope.response_o.data.order.sub_orders[i].sub_order_id);
                //document.getElementById('Detail' + $scope.response_o.data.order.sub_orders[i].sub_order_id).addEventListener('click', function(event) {

                var count1 = 0;
                $scope.dummy = [];
                $scope.tempShip = '';
                $scope.SubOrderList = [];
                $scope.ShipmentList = [];
                $scope.Shipment = false;
                //$scope.$apply();
                for (var i = 0; i < $scope.response_o.data.order.sub_orders.length; i++) {
                    angular.forEach($scope.response_o.data.order.sub_orders[i].shipments, function(value, key) {
                        if (value.sub_order_id == $scope.selectedSubOrder) {
                            //var tempShip = value.ship_to.address1 ? value.ship_to.address1 : '' + "," + value.ship_to.address2 ? value.ship_to.address2 : '';
                            angular.forEach(value.ship_to, function(elm, key) {
                                if (elm != null) {
                                    console.log(elm);
                                    $scope.tempShip = $scope.tempShip + ' ' + elm;
                                }
                            })
                            $scope.getLink = function(carrier, number) {
                                if (carrier) {
                                    console.log(carrier);
                                    return carrier.includes("DHL") ? "http://www.dhl.com/en/express/tracking.shtml?AWB=" + number + "&brand=DHL" : carrier.includes("FEDEX") ? "https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=" + number + "&cntry_code=us" : carrier.includes("PILOT") ? "http://www.pilotdelivers.com/quicktrack.aspx?Pro=" + number : "javascript.void(0)"
                                }
                            }
                            $scope.dummy.push({
                                'ge_order_number': value.ge_order_number,
                                'ship_to': $scope.tempShip,
                                'shipment_id': value.shipment_id,
                                'sub_order_id': value.sub_order_id,
                                'ship_date': value.ship_date ? $filter('date')(new Date(value.ship_date * 1000), 'MMM dd, yyyy') : '',
                                'delivery_date': value.delivery_date ? $filter('date')(new Date(value.delivery_date * 1000), 'MMM dd, yyyy') : '',
                                'shipment_ff_state': value.shipment_ff_state,
                                'pod': value.tracking_number,
                                'trackingLink': $scope.getLink(value.carrier, value.tracking_number)
                            });
                            $scope.tempShip = '';
                            $scope.SubOrderList[count1] = $scope.dummy[count1];
                            $scope.SubOrderList[count1].SrNo = count1 + 1;
                            $scope.SubOrderList[count1].ship_to = $scope.dummy[count1].ship_to;
                            ++count1;
                        }
                    })
                }

                $scope.lengthofShipments = $scope.SubOrderList.length;
                $scope.CreateShipmentJson1();
                if ($scope.SubOrderList.length > 0) {
                    $scope.Suborder = true;
                    //$scope.$apply();
                } else {
                    $scope.Suborder = false;
                }
                //         }, false);
                //     }
                // }, 2000);
            }
            $scope.Redirect = function(url) {
                window.open(url, '_blank');
            }
            // Call Comparision api when order is change_requested and CR is pending
            //or when order is in accepted and CR is accepted
            if (($scope.orderStatus == 'change_requested' && $scope.CRStatus == 'pending') || ($scope.orderStatus == 'accepted' && $scope.CRStatus == 'accepted') || ($scope.orderStatus == 'change_requested' && $scope.CRStatus == 'pending' && $scope.crData.from == 'system')) {
                document.getElementById('ToggleVersion').style.display = 'block';
                diffCode($scope.orderNumber, $scope.customerId);
            }

        })
        $scope.ToggleVersion = function() {
          $scope.MessageDisplay=!$scope.MessageDisplay;
            if(!$scope.MessageDisplay){
            document.getElementById('ToggleVersion').style.cssText = 'background-color:#60bd68 !important;border-color:#0e6916 !important';
            $scope.Message="Click Here to View Current Version";
            }
            else{
              document.getElementById('ToggleVersion').style.cssText = 'background-color:#f15854 !important;border-color:#560907 !important';
            $scope.Message="Click Here to View Previous Version";
            }
            $scope.Loading = true;
            $scope.OrderList = [];
            $scope.SubOrderList = [];
            $scope.ShipmentList = [];
            var count = 0;
            var count2 = 0;
            var count1 = 0;
            $scope.Suborder = false;
            diffCode($scope.orderNumber, $scope.customerId);
            $scope.CurrentVersion = !$scope.CurrentVersion;
            console.log($scope.CurrentVersion);
            $scope.ForAccordians();
        }
        $scope.saveSubOrder = function(val) {
            $("#accordion-" + val).slideToggle("slow");
            $(".acc-" + val).css("backgroundColor", "#3c8dc6");
            $(".acc-" + val).css("color", "white");
            if ($scope.temp && $scope.temp != val) {
                if ($("#accordion-" + $scope.temp).is(':visible')) {
                    $("#accordion-" + $scope.temp).slideUp("slow");
                    $(".acc-" + $scope.temp).css("backgroundColor", "white");
                    $(".acc-" + $scope.temp).css("color", "black");
                }
            }
            $scope.temp = val;
            $scope.selectedSubOrder = val;
            $scope.CreateSubOrderJson1();
        };
        $scope.saveShipment = function(val) {
            $(".accordion1-" + val).slideToggle('slow');
            $(".acc1-" + val).css("backgroundColor", "#3c8dc6");
            $(".acc1-" + val).css("color", "white");
            if ($scope.temp1 && $scope.temp1 != val) {
                if ($(".accordion1-" + $scope.temp1).is(':visible')) {
                    $(".accordion1-" + $scope.temp1).slideUp('slow');
                    $(".acc1-" + $scope.temp).css("backgroundColor", "white");
                    $(".acc1-" + $scope.temp).css("color", "black");
                }
            }
            $scope.temp1 = val;
            $scope.selectedShipment = val;
            $scope.CreateShipmentJson1();
        };
        $scope.CreateShipmentJson1 = function() {
            // $timeout(function() {
            //     for (var i = 0; i < $scope.SubOrderList.length; i++) {
            //         document.getElementById('Details' + $scope.SubOrderList[i].shipment_id).addEventListener('click', function(event) {
            $scope.dummy1 = [];
            //$scope.selectedShipment = event.target.className;
            var count2 = 0;
            $scope.ShipmentList = [];
            //debugger
            angular.forEach($scope.response_o.data.order.order_lines, function(value, key) {
                if (value.shipment_id == $scope.selectedShipment) {
                    $scope.dummy1.push({
                        'line_number': value.line_number,
                        'item_number': value.item_number,
                        'line_item_description': value.line_item_description,
                        'quantity': value.quantity,
                        'sub_order_id': value.sub_order_id,
                        'shipment_id': value.shipment_id,
                        'list_price': value.list_price,
                        'discount_perc': value.discount_perc,
                        'selling_price': value.price,
                        'model_type': value.model_type
                    });
                    $scope.ShipmentList[count2] = $scope.dummy1[count2];
                    $scope.ShipmentList[count2].SrNo = count2 + 1;
                    $scope.ShipmentList[count2].model_type = $scope.dummy1[count2].model_type;
                    $scope.ShipmentList[count2].selling_price = $filter('currency')($scope.dummy1[count2].selling_price, 'USD ', 2);
                    $scope.ShipmentList[count2].list_price = $filter('currency')($scope.dummy1[count2].list_price, 'USD ', 2);
                    $scope.ShipmentList[count2].discount_perc = $filter('number')($scope.dummy1[count2].discount_perc, 0);
                    count2++;
                }
            })

            $scope.LengthOfShipment = $scope.ShipmentList.length;
            if ($scope.ShipmentList.length > 0) {
                $scope.Shipment = true;
                //$scope.$apply();
            } else {
                $scope.Shipment = false;
                //$scope.$apply();
            }

            //         }, false);
            //
            //     }
            // }, 1000);
        }

        //Show Differences code
        function diffCode(oNo, custId) {
            CrService.getCrDiffDetails(oNo, custId).then(function success(response) {
                console.log(response);
                $scope.Loading = false;
                //$scope.response = response.data[0];
                if ($scope.CurrentVersion == true) {
                    $scope.response = response.data[0];
                } else {
                    $scope.response = response.data[2];
                }
                $scope.shipTo_1 = ($scope.response.sub_orders[0].shipments[0].ship_to.address1 ? $scope.response.sub_orders[0].shipments[0].ship_to.address1 : '');
                $scope.shipTo_2 = ($scope.response.sub_orders[0].shipments[0].ship_to.address2 ? $scope.response.sub_orders[0].shipments[0].ship_to.address2 : '');
                $scope.shipTo_3 = ($scope.response.sub_orders[0].shipments[0].ship_to.address3 ? $scope.response.sub_orders[0].shipments[0].ship_to.address3 : '');
                $scope.shipTo_4 = ($scope.response.sub_orders[0].shipments[0].ship_to.city ? $scope.response.sub_orders[0].shipments[0].ship_to.city : '');
                $scope.shipTo_5 = ($scope.response.sub_orders[0].shipments[0].ship_to.country ? $scope.response.sub_orders[0].shipments[0].ship_to.country : '');
                $scope.shipTo_6 = ($scope.response.sub_orders[0].shipments[0].ship_to.postalcode ? $scope.response.sub_orders[0].shipments[0].ship_to.postalcode : '');
                $scope.shipTo_7 = ($scope.response.sub_orders[0].shipments[0].ship_to.province ? $scope.response.sub_orders[0].shipments[0].ship_to.province : '');
                $scope.shipTo_8 = ($scope.response.sub_orders[0].shipments[0].ship_to.state ? $scope.response.sub_orders[0].shipments[0].ship_to.state : '');
                $scope.billTo_1 = $scope.response.sub_orders[0].bill_to.address1 ? " " + $scope.response.sub_orders[0].bill_to.address1 : '';
                $scope.billTo_2 = $scope.response.sub_orders[0].bill_to.address2 ? " " + $scope.response.sub_orders[0].bill_to.address2 : '';
                $scope.billTo_3 = $scope.response.sub_orders[0].bill_to.address3 ? " " + $scope.response.sub_orders[0].bill_to.address3 : '';
                $scope.billTo_4 = ($scope.response.sub_orders[0].bill_to.city) ? " " + $scope.response.sub_orders[0].bill_to.city : '';
                $scope.billTo_5 = ($scope.response.sub_orders[0].bill_to.country) ? " " + $scope.response.sub_orders[0].bill_to.country : '';
                $scope.billTo_6 = ($scope.response.sub_orders[0].bill_to.postalcode) ? " " + $scope.response.sub_orders[0].bill_to.postalcode : '';
                $scope.billTo_7 = ($scope.response.sub_orders[0].bill_to.province) ? " " + $scope.response.sub_orders[0].bill_to.province : '';
                $scope.billTo_8 = ($scope.response.sub_orders[0].bill_to.state) ? " " + $scope.response.sub_orders[0].bill_to.state : '';
                $scope.bill_to = $scope.billTo_1 + $scope.billTo_2 + $scope.billTo_3 + $scope.billTo_4 + $scope.billTo_7 + $scope.billTo_8 + $scope.billTo_5 + $scope.billTo_6;
                $scope.order_ff_state = $scope.response.order_ff_state;
                $scope.contract_amount = $scope.response.contract_amount;
                console.log(contract_amount);

                //For highlighting changed values of Order Headers
                if ($scope.CurrentVersion == true) {
                    for (var i = 0; i < response.data[1].order_header.length; i++) {
                      if(response.data[1].order_header[i] == 'contract_amount'){
                        $('#' + response.data[1].order_header[i]).removeClass("cr_id").css("color", "#4CAF50");
                      }else{
                        $('#' + response.data[1].order_header[i]).css("color", "#4CAF50");
                        $('#' + response.data[1].order_header[i]).css("font-weight", "bold");
                      }
                    }
                }

                //$scope.orderNumber = $scope.response.ge_order_number;
                $scope.orderdate = new Date($scope.response.order_date * 1000);
                //$scope.POnumber = $scope.response.cust_po_number;
                $scope.taxable_status = $scope.response.taxable_status;
                //$scope.liquidated_damage_terms=$scope.response.liquidated_damage_terms;
                $scope.delivery_terms = $scope.response.delivery_terms;
                //$scope.customer_number=$scope.response.customer_number;

                //For Sub-Order Table
                $scope.OrderList = [];
                $scope.tempBillTo="";
                count = 0;
                //  debugger
                angular.forEach($scope.response.sub_orders, function(value, key) {
                  $scope.tempBillTo="";
          angular.forEach(value.bill_to, function(elm, key) {
            if(elm != null){
              //console.log(elm);
              $scope.tempBillTo = $scope.tempBillTo + ' ' + elm;
            }
          })

                    $scope.OrderList[count] = value;
                    $scope.OrderList[count].billToaddress = $scope.tempBillTo;
                    $scope.OrderList[count].SrNo = count + 1;
                    $scope.shipTo_1 = ($scope.response.sub_orders[0].shipments[0].ship_to.address1 ? $scope.response.sub_orders[0].shipments[0].ship_to.address1 : '');
                    $scope.shipTo_2 = ($scope.response.sub_orders[0].shipments[0].ship_to.address2 ? $scope.response.sub_orders[0].shipments[0].ship_to.address2 : '');
                    $scope.shipTo_3 = ($scope.response.sub_orders[0].shipments[0].ship_to.address3 ? $scope.response.sub_orders[0].shipments[0].ship_to.address3 : '');
                    $scope.shipTo_4 = ($scope.response.sub_orders[0].shipments[0].ship_to.city ? $scope.response.sub_orders[0].shipments[0].ship_to.city : '');
                    $scope.shipTo_5 = ($scope.response.sub_orders[0].shipments[0].ship_to.country ? $scope.response.sub_orders[0].shipments[0].ship_to.country : '');
                    $scope.shipTo_6 = ($scope.response.sub_orders[0].shipments[0].ship_to.postalcode ? $scope.response.sub_orders[0].shipments[0].ship_to.postalcode : '');
                    $scope.shipTo_7 = ($scope.response.sub_orders[0].shipments[0].ship_to.province ? $scope.response.sub_orders[0].shipments[0].ship_to.province : '');
                    $scope.shipTo_8 = ($scope.response.sub_orders[0].shipments[0].ship_to.state ? $scope.response.sub_orders[0].shipments[0].ship_to.state : '');
                    $scope.ship_to = $scope.shipTo_1 + $scope.shipTo_2 + $scope.shipTo_3 + $scope.shipTo_4 + $scope.shipTo_7 + $scope.shipTo_8 + $scope.shipTo_5 + $scope.shipTo_6;
                    $scope.OrderList[count].shipToaddress = $scope.ship_to;
                    $scope.OrderList[count].ros_date = value.ros_date ? $filter('date')(new Date(value.ros_date * 1000), 'MMM dd, yyyy') : '';

                    $scope.OrderList[count].sch_date = value.sch_date ? $filter('date')(new Date(value.sch_date * 1000), 'MMM dd, yyyy') : '';
                    $scope.OrderList[count].ship_date = value.ship_date ? $filter('date')(new Date(value.ship_date * 1000), 'MMM dd, yyyy') : '';
                    console.log(value.delivery_date);
                    $scope.OrderList[count].delivery_date = value.delivery_date ? $filter('date')(new Date(value.delivery_date * 1000), 'MMM dd, yyyy') : '';
                    $scope.OrderList[count].billing_amount = $filter('currency')(value.billing_amount, 'USD ', 2);
                    //$scope.OrderList[count].link = "<a id='Detail" + value.sub_order_id + "' class=" + value.sub_order_id + " href='javascript:void(0)'>Details</a>";
                    count++;
                })
                console.log($scope.OrderList);
                $scope.lengthofSubOrders = $scope.OrderList.length;

                //For Highlighting changed Row of Sub_Order
                if ($scope.CurrentVersion == true) {
                    $timeout(function() {
                        $scope.colorSubOrder();
                    }, 100);
                }
                $scope.colorSubOrder = function() {
                    //debugger;
                    for (var i = 0; i < response.data[1].sub_orders.length; i++) {
                        //console.log("Changed Sub_orders:"+response.data[0].changedValues[0].sub_orders[i].sub_order_id);
                        $('#Sub_Order' + response.data[1].sub_orders[i].sub_order_id).css("background-color", "#85e085");
                        //$('#Sub_Order' + response.data[0].changedValues[0].sub_orders[i].sub_order_id).css("font-weight", "bold");
                    }

                    //Fields of SubOrder
                    if ($scope.CurrentVersion == true) {
                        for (var i = 0; i < response.data[1].sub_orders.length; i++) {
                            for (var j = 0; j < response.data[1].sub_orders[i].ischanged.length; j++) {
                                //console.log("Changed Sub_orders:" + response.data[0].changedValues[0].sub_orders[i].sub_order_id + " and Column Name:" + response.data[0].changedValues[0].sub_orders[i].ischanged[j]);
                                $('#' + response.data[1].sub_orders[i].ischanged[j] + response.data[1].sub_orders[i].sub_order_id).css("color", "#1a651a");
                                $('#' + response.data[1].sub_orders[i].ischanged[j] + response.data[1].sub_orders[i].sub_order_id).css("font-weight", "bold");
                                $('#' + response.data[1].sub_orders[i].ischanged[j] + response.data[1].sub_orders[i].sub_order_id).css("text-decoration", "underline");
                            }
                        }
                    }
                }

                //For Shipment Table

                $scope.saveSubOrder = function(val) {
                    $("#accordion-" + val).slideToggle("slow");
                    $(".acc-" + val).css("backgroundColor", "#3c8dc6");
                    $(".acc-" + val).css("color", "white");
                    if ($scope.temp && $scope.temp != val) {
                        if ($("#accordion-" + $scope.temp).is(':visible')) {
                            $("#accordion-" + $scope.temp).slideUp("slow");
                            $(".acc-" + $scope.temp).css("backgroundColor", "white");
                            $(".acc-" + $scope.temp).css("color", "black");
                        }
                    }
                    $scope.temp = val;
                    $scope.selectedSubOrder = val;
                    $scope.CreateSubOrderJson();
                };
                $scope.CreateSubOrderJson = function() {
                    // $timeout(function() {
                    //     for (var i = 0; i < $scope.response.sub_orders.length; i++) {
                    //         document.getElementById('Detail' + $scope.response.sub_orders[i].sub_order_id).addEventListener('click', function(event) {
                    var count1 = 0;
                    $scope.dummy = [];
                    $scope.tempShip = '';
                    $scope.SubOrderList = [];
                    $scope.ShipmentList = [];
                    $scope.Shipment = false;
                    for (var i = 0; i < $scope.response.sub_orders.length; i++) {
                        angular.forEach($scope.response.sub_orders[i].shipments, function(value, key) {
                            if (value.sub_order_id == $scope.selectedSubOrder) {
                                angular.forEach(value.ship_to, function(elm, key) {
                                    if (elm != null) {
                                        console.log(elm);
                                        $scope.tempShip = $scope.tempShip + " " + elm;
                                    }
                                })
                                $scope.getLink = function(carrier, number) {
                                    if (carrier) {
                                        return carrier.includes("DHL") ? "http://www.dhl.com/en/express/tracking.shtml?AWB=" + number + "&brand=DHL" : carrier.includes("FEDEX") ? "https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=" + number + "&cntry_code=us" : carrier.includes("PILOT") ? "http://www.pilotdelivers.com/quicktrack.aspx?Pro=" + number : "javascript.void(0)"
                                    }
                                }
                                $scope.dummy.push({
                                    'ge_order_number': value.ge_order_number,
                                    'ship_to': $scope.tempShip,
                                    'shipment_id': value.shipment_id,
                                    'sub_order_id': value.sub_order_id,
                                    'shipment_ff_state': value.shipment_ff_state,
                                    'ship_date': value.ship_date ? $filter('date')(new Date(value.ship_date * 1000), 'MMM dd, yyyy') : '',
                                    'delivery_date': value.delivery_date ? $filter('date')(new Date(value.delivery_date * 1000), 'MMM dd, yyyy') : '',
                                    'pod': value.tracking_number,
                                    'trackingLink': $scope.getLink(value.carrier, value.tracking_number)
                                });
                                $scope.tempShip = '';
                                $scope.SubOrderList[count1] = $scope.dummy[count1];
                                $scope.SubOrderList[count1].SrNo = count1 + 1;
                                $scope.SubOrderList[count1].ship_to = $scope.dummy[count1].ship_to;
                                //debugger
                                ++count1;
                            }
                        })
                    }
                    //For Highlighting changed Row of Shipment
                    if ($scope.CurrentVersion == true) {
                        $timeout(function() {
                            $scope.colorShipment();
                        }, 100);
                    }
                    $scope.colorShipment = function() {
                        //debugger
                        angular.forEach(response.data[1].sub_orders, function(value, key) {
                            if (value.shipments) {
                                for (var i = 0; i < value.shipments.length; i++) {
                                    //console.log(value.shipments[i].shipment_id);
                                    $('#accordion-'+ value.sub_order_id).find('.Shipment' + value.shipments[i].shipment_id).css("background-color", "#85e085");
                                    //$('#Shipment' + value.shipments[i].shipment_id).css("font-weight", "bold");
                                }
                            }
                        })

                        //Fields of Shipments
                        if ($scope.CurrentVersion == true) {
                            angular.forEach(response.data[1].sub_orders, function(value, key) {
                                if (value.shipments) {
                                    for (var i = 0; i < value.shipments.length; i++) {
                                        for (var j = 0; j < value.shipments[i].ischanged.length; j++) {
                                            //console.log("Changed Shipment_Id:"+value.shipments[i].shipment_id+" and Column Name:"+value.shipments[i].ischanged[j]);
                                            $('#' + value.shipments[i].ischanged[j] + value.shipments[i].shipment_id).css("color", "#1a651a");
                                            $('#' + value.shipments[i].ischanged[j] + value.shipments[i].shipment_id).css("font-weight", "bold");
                                            $('#' + value.shipments[i].ischanged[j] + value.shipments[i].shipment_id).css("text-decoration", "underline");
                                        }
                                    }
                                }
                            })
                        }
                    }
                    $scope.lengthofShipments = $scope.SubOrderList.length;
                    $scope.CreateShipmentJson();
                    if ($scope.SubOrderList.length > 0) {
                        $scope.Suborder = true;
                        //$scope.$apply();
                    } else {
                        //$scope.Suborder = false;
                    }
                    //         }, false);
                    //     }
                    // }, 1000);
                }
                //For Order Lines
                $scope.saveShipment = function(val) {
                   $(".accordion1-" + val).slideToggle('slow');
                    $(".acc1-" + val).css("backgroundColor", "#3c8dc6");
                    $(".acc1-" + val).css("color", "white");
                    if ($scope.temp1 && $scope.temp1 != val) {
                        if ($(".accordion1-" + $scope.temp1).is(':visible')) {
                            $(".accordion1-" + $scope.temp1).slideUp('slow');
                            $(".acc1-" + $scope.temp).css("backgroundColor", "white");
                            $(".acc1-" + $scope.temp).css("color", "black");
                        }
                    }
                    $scope.temp1 = val;
                    $scope.selectedShipment = val;
                    $scope.CreateShipmentJson();
                };
                //For OrderLines Table
                $scope.CreateShipmentJson = function() {
                    // $timeout(function() {
                    //     for (var i = 0; i < $scope.SubOrderList.length; i++) {
                    //         document.getElementById('Details' + $scope.SubOrderList[i].shipment_id).addEventListener('click', function(event) {
                    $scope.dummy1 = [];
                    //$scope.selectedShipment = event.target.className;
                    var count2 = 0;
                    $scope.ShipmentList = [];
                    angular.forEach($scope.response.order_lines, function(value, key) {
                        if (value.shipment_id == $scope.selectedShipment) {
                            $scope.dummy1.push({
                                'line_number': value.line_number,
                                'item_number': value.item_number,
                                'line_item_description': value.line_item_description,
                                'quantity': value.quantity,
                                'sub_order_id': value.sub_order_id,
                                'shipment_id': value.shipment_id,
                                'list_price': value.list_price,
                                'discount_perc': value.discount_perc,
                                'model_type': value.model_type,
                                'selling_price': $filter('currency')(value.price, 'USD ', 2)
                            });
                            $scope.ShipmentList[count2] = $scope.dummy1[count2];
                            $scope.ShipmentList[count2].SrNo = count2 + 1;
                            $scope.ShipmentList[count2].model_type = value.model_type;
                            $scope.ShipmentList[count2].selling_price = $filter('currency')(value.price, 'USD ', 2);
                            $scope.ShipmentList[count2].list_price = $filter('currency')($scope.ShipmentList[count2].list_price, 'USD ', 2);
                            $scope.ShipmentList[count2].discount_perc = $filter('number')($scope.ShipmentList[count2].discount_perc, 0);
                            count2++;
                        }
                    })
                    //For Highlighting changed Row of Line Item
                    if ($scope.CurrentVersion == true) {
                        $timeout(function() {
                            $scope.colorLineItem();
                        }, 100);
                    }
                    $scope.colorLineItem = function() {
                        for (var i = 0; i < response.data[1].order_lines.length; i++) {
                            //console.log("Changed Order_Lines:"+response.data[0].changedValues[0].order_lines[i]);
                            $('#LineItem' + response.data[1].order_lines[i]).css("background-color", "#85e085");
                            //$('#LineItem' + response.data[0].changedValues[0].order_lines[i]).css("font-weight", "bold");
                        }
                    }
                    $scope.LengthOfShipment = $scope.ShipmentList.length;
                    if ($scope.ShipmentList.length > 0) {
                        $scope.Shipment = true;
                        //$scope.$apply();
                    } else {
                        $scope.Shipment = false;
                        //$scope.$apply();
                    }

                    //     }, false);
                    //
                    // }
                    //}, 1000);
                }

            })
        }
        $scope.acceptBtnClicked = function() {
            $("input[class^='MandatoryField']").on('change keyup paste mouseup',function(e) {
                var alltxt = $("input[class^='MandatoryField']").length;
                $scope.Validation = true;
                $("input[class^='MandatoryField']").each(function(i) {
                    if ($(this).val().trim() == '') {
                        $scope.Validation = true;
                        $scope.Validation1 = false;
                        $scope.DisableAccept();
                        return false;
                    } else {
                        $scope.Validation = false;
                        $scope.Validation1 = false;
                        $scope.DisableAccept();
                    }
                });
                if (!$scope.Validation) {
                    $scope.enableAccept();
                    $scope.Validation = true;
                    $scope.Validation1 = true;
                    //alert("Done");
                }
            });
            $scope.acptBtn = true;
            $scope.showLinkInput = true;
        }

        $scope.rejectBtnClicked = function () {
          $("textarea[class^='MandatoryField']").on('change keyup paste mouseup',function(e) {
                var alltxt = $("input[class^='MandatoryField']").length;
                $scope.Validation2 = true;
                $("textarea[class^='MandatoryField']").each(function(i) {
                    if ($(this).val().trim() == '') {
                        $scope.Validation2 = true;
                        $scope.Validation3 = false;
                        $scope.DisableReject();
                        return false;
                    } else {
                        $scope.Validation2 = false;
                        $scope.Validation3 = false;
                        $scope.DisableReject();
                    }
                });
                if (!$scope.Validation2) {
                    $scope.enableReject();
                    $scope.Validation2 = true;
                    $scope.Validation3 = true;
                    //alert("Done");
                }
            });
          $scope.rejectBtn = true;
          $scope.showTextInput = true;
        }

        $scope.DisableAccept = function() {
            var d = document.getElementById("acceptButton1");
            d.className += " disabled";
            d.classList.remove("btn-primary");
        }
        $scope.enableAccept = function() {
            var d = document.getElementById("acceptButton1");
            d.className += " btn btn-primary";
            d.classList.remove("disabled");
        }
        $scope.DisableReject = function() {
            var d = document.getElementById("rejectButton");
            d.className += " disabled";
            d.classList.remove("btn-reject");
        }
        $scope.enableReject = function() {
            var d = document.getElementById("rejectButton");
            d.className += " btn btn-reject";
            d.classList.remove("disabled");
        }

        $scope.acceptClicked = function() {
            $scope.Loading1 = true;
            // var d = document.getElementById("AcceptButton");
            // var d1 = document.getElementById("RejectButton");
            // d.className += " disabled";
            // d1.className += " disabled";
            console.log($scope.crData.supporting_documents);
            $scope.showLinkInput = false;
            var crDocs = $scope.crData.supporting_documents;
            //console.log(Object.keys($scope.crData.supporting_documents).length);
            var length = Object.keys($scope.crData.supporting_documents).length;
            crDocs[Object.keys($scope.crData.supporting_documents).length] = {
                'document_type': 'link',
                'description': 'ChangeLetter_link',
                'url': $scope.ltrLink,
                'hash': ''
            };
            console.log(crDocs);
            var crdata = {
                'from': $scope.crData.from,
                'to': $scope.crData.to,
                'cc': $scope.crData.cc,
                'subject': $scope.crData.subject,
                'description': $scope.crData.description,
                'ge_order_number': $scope.crData.ge_order_number,
                'cust_po_number': $scope.crData.cust_po_number,
                'sub_order_id': $scope.crData.sub_order_id,
                'contract_amount': $scope.crData.contract_amount,
                'change_req_id': $scope.crData.change_req_id,
                'cr_date': $scope.crData.cr_date,
                'dispute_ref': $scope.crData.dispute_ref,
                'order_date': $scope.crData.order_date,
                'parentCustId': $scope.crData.parentCustId,
                'status': $scope.crData.status,
                'supporting_documents': crDocs,
                'tc_order_version': $scope.crData.tc_order_version
            };
            console.log(crdata);
            CrService.acceptCR($scope.crData.change_req_id, $scope.customerId, crdata).success(function(response) {
                alert('Change Request is accepted');
                $scope.Loading1 = false;
                $state.reload();
            })

            //console.log($scope.data);
        }

        $scope.rejectClicked = function() {
            $scope.Loading1 = true;
            // var d = document.getElementById("AcceptButton");
            // var d1 = document.getElementById("RejectButton");
            // d.className += " disabled";
            // d1.className += " disabled";

            var crdata = {
                'from': $scope.crData.from,
                'to': $scope.crData.to,
                'cc': $scope.crData.cc,
                'subject': $scope.crData.subject,
                'description': $scope.crData.description,
                'ge_order_number': $scope.crData.ge_order_number,
                'cust_po_number': $scope.crData.cust_po_number,
                'sub_order_id': $scope.crData.sub_order_id,
                'contract_amount': $scope.crData.contract_amount,
                'change_req_id': $scope.crData.change_req_id,
                'cr_date': $scope.crData.cr_date,
                'dispute_ref': $scope.crData.dispute_ref,
                'order_date': $scope.crData.order_date,
                'parentCustId': $scope.crData.parentCustId,
                'status': $scope.crData.status,
                'supporting_documents': $scope.crData.supporting_documents,
                'tc_order_version': $scope.crData.tc_order_version,
                'comments' : $scope.rej_comment
            };
            // var crd = new FormData();
            // crd.append('file', '');
            // crd.append('crbody', JSON.stringify(crdata));
            CrService.rejectCR($scope.crData.change_req_id, $scope.customerId, crdata).success(function(response) {
                alert('Change Request is rejected');
                $scope.Loading1 = false;
                $state.reload();
            });
        }
        $scope.approveClicked = function() {
            var orderData = $scope.crData.order;

            // var crd = new FormData();
            // crd.append('file', '');
            // crd.append('crbody', JSON.stringify(crdata));
            console.log(orderData);
            console.log('in approve');
            CrService.approveOrder($scope.orderNumber, $scope.customerId, orderData).success(function(response) {
                alert('success!');
                $state.reload();
            });
        }

        $scope.applyCss = function() {
            $scope.colorSubOrder();
            $scope.colorShipment();
            $scope.colorLineItem();
        }

        $scope.displayFile = function(fileName) {
            QuotesService.viewDocument(fileName).success(function(response) {
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
                var blob = new Blob(byteArrays, {
                    type: 'application/pdf'
                });
                var objectUrl = URL.createObjectURL(blob);
                //console.log(objectUrl);
                //var fURL = $sce.trustAsResourceUrl(objectUrl);
                window.open(objectUrl);
            });
        }

    }]);
});
