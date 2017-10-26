define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('adminCtrl', ['$scope', '$log', '$timeout', '$interval', '$http', 'PredixUserService', 'AdminService', '$window', '$filter', '$location', '$state', function($scope, $log, $timeout, $interval, $http, PredixUserService, AdminService, $window, $filter, $location, $state) {
        $scope.ChangeRequestList = [];
        $scope.Loading = true;
        $scope.Loading1 = false;
        $scope.Loading2 = false;
        $scope.tempPayeeAddress='';
        $scope.tempPayeeBankAddress='';
        $scope.invoiceLogs = [];
        $scope.invoiceUploadClicked = true;
        $scope.CustomerSettings = true;
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
        document.getElementById("Save").style.display = "none";
        var elements = document.getElementsByClassName("Form");
        for (var i = 0; i < elements.length; i++) {
            elements[i].disabled = true;
        }

        $scope.go = function(path) {
            $location.path(path);
        };

        $scope.uploadInvoice = function() {
            $scope.Loading1=true;
            var rd = new FormData();
            angular.forEach($scope.files, function(file) {
                rd.append('file', file);
            });

            AdminService.uploadInvoice(rd).then(function success(response) {
                $scope.Loading1=false;
                $state.reload();
            })
        }

        function loadInvoiceLogs() {
            $scope.invoiceLogs = [];
            AdminService.getInvoiceLogs().success(function(response) {
              $scope.Loading = false;
                angular.forEach(response, function(value, key) {
                    $scope.invoiceLogs.push({
                        "id": value.id,
                        "file_name": value.file_name,
                        "total_rows": value.total_rows,
                        "no_of_rows_loaded": value.no_of_rows_loaded,
                        "no_of_rows_failed": value.no_of_rows_failed,
                        "upload_status": value.upload_status,
                        "uploaded_by": value.uploaded_by,
                        "uploaded_date": value.uploaded_date ? $filter('date')(value.uploaded_date, "MMM dd, yyyy") : '',
                        "action": value.upload_status == 'Initiated' ? "<a id='Process" + value.id + "' class='btn btn-primary " + value.id + "'>Process</a>" : ""
                    });
                })
            })
        }

        document.getElementById("invoiceLogTable").addEventListener("px-cell-click", function(e) {
          var clickedRow = e.detail.row;
          var clickedCol = e.detail.column.className;
          console.log("Cell clicked: ", clickedRow);
          if(clickedCol == 'processInvoice'){
            $scope.processInvoiceClicked(clickedRow.row.id.value);
          }
        });

        loadInvoiceLogs();

        $scope.refreshClicked = function() {
            $scope.Loading=true;
            loadInvoiceLogs();
        }
        $scope.processInvoiceClicked = function(id) {
            $scope.Loading=true;
            AdminService.processInvoice(id).success(function(response) {
                $scope.Loading=false;
                alert('Invoice Processed Successfully');
                loadInvoiceLogs();
            })
        }

        //Settings

        //Show Payee Address individual fields
        $(document).ready(function(){
          $('#PayeeAddress').click(function() { $scope.displayPayeeAddressBlock(); })
          })
          $scope.displayPayeeAddressBlock=function(){
            document.getElementById("SubTab").style.height = (parseInt(document.getElementById("SubTab").style.height)+400).toString()+"px";
            document.getElementById("PayeeAddress").readOnly = true;
            $("#PayeeAddressBlock").slideDown("slow");
          }

        //Show Payee Bank Address individual fields
        $(document).ready(function(){
          $('#PayeeBankAddress').click(function() { $scope.displayPayeeBankAddressBlock(); })
          })
          $scope.displayPayeeBankAddressBlock=function(){
            document.getElementById("SubTab").style.height = (parseInt(document.getElementById("SubTab").style.height)+400).toString()+"px";
            document.getElementById("PayeeBankAddress").readOnly = true;
            $("#PayeeBankAddressBlock").slideDown("slow");
          }

        //Toggle height of the sub tab section
        $scope.PaymentClicked = function() {
          $("#PayeeBankAddressBlock").slideUp("slow");
          $("#PayeeAddressBlock").slideUp("slow");
          document.getElementById("SubTab").style.height = "950px";
        }

        //Toggle height of the sub tab section
        $scope.CustomerClicked = function() {
            document.getElementById("SubTab").style.height = "415px";
        }

        //Get Existing Settings
        $scope.getSettingsData = function() {
          $scope.tempPayeeAddress='';
          $scope.tempPayeeBankAddress='';
            AdminService.fetchAdminJson($scope.selectedCustomer).then(function success(response) {
                document.getElementById("Save").style.display = "block";
                var elements = document.getElementsByClassName("Form");
                for (var i = 0; i < elements.length; i++) {
                    elements[i].disabled = false;
                }

                $scope.SettingsData = response.data;
                console.log("Incoming:");
                console.log($scope.SettingsData);
                if ($scope.SettingsData.invoicedue_notification_flag == true) {
                    $scope.Notifications = "Yes";
                } else {
                    $scope.Notifications = "No";
                }
                $scope.frequency = $scope.SettingsData.invoicedue_notification_frequency;
                $scope.payment_mode = $scope.SettingsData.paymentAdmin.payment_mode;
                $scope.payee_name = $scope.SettingsData.paymentAdmin.payee_name;
                angular.forEach($scope.SettingsData.paymentAdmin.payee_address, function(elm, key) {
                    if (elm != null) {
                        $scope.tempPayeeAddress = $scope.tempPayeeAddress + ' ' + elm;
                    }
                })
                $scope.payee_address=$scope.tempPayeeAddress;
                $scope.payee_address_address1=$scope.SettingsData.paymentAdmin.payee_address.address1;
                $scope.payee_address_address2=$scope.SettingsData.paymentAdmin.payee_address.address2;
                $scope.payee_address_address3=$scope.SettingsData.paymentAdmin.payee_address.address3;
                $scope.payee_address_city=$scope.SettingsData.paymentAdmin.payee_address.city;
                $scope.payee_address_country=$scope.SettingsData.paymentAdmin.payee_address.country;
                $scope.payee_address_postalcode=$scope.SettingsData.paymentAdmin.payee_address.postalcode;
                $scope.payee_address_province=$scope.SettingsData.paymentAdmin.payee_address.province;
                $scope.payee_address_state=$scope.SettingsData.paymentAdmin.payee_address.state;
                $scope.payee_bank_name = $scope.SettingsData.paymentAdmin.payee_bank_name;
                angular.forEach($scope.SettingsData.paymentAdmin.payee_bank_address, function(elm, key) {
                    if (elm != null) {
                        $scope.tempPayeeBankAddress = $scope.tempPayeeBankAddress + ' ' + elm;
                    }
                })
                $scope.payee_bank_address=$scope.tempPayeeBankAddress;
                $scope.payee_bank_address_address1=$scope.SettingsData.paymentAdmin.payee_bank_address.address1;
                $scope.payee_bank_address_address2=$scope.SettingsData.paymentAdmin.payee_bank_address.address2;
                $scope.payee_bank_address_address3=$scope.SettingsData.paymentAdmin.payee_bank_address.address3;
                $scope.payee_bank_address_city=$scope.SettingsData.paymentAdmin.payee_bank_address.city;
                $scope.payee_bank_address_country=$scope.SettingsData.paymentAdmin.payee_bank_address.country;
                $scope.payee_bank_address_postalcode=$scope.SettingsData.paymentAdmin.payee_bank_address.postalcode;
                $scope.payee_bank_address_province=$scope.SettingsData.paymentAdmin.payee_bank_address.province;
                $scope.payee_bank_address_state=$scope.SettingsData.paymentAdmin.payee_bank_address.state;
                $scope.payee_bank_acc_number = $scope.SettingsData.paymentAdmin.payee_acc_number;
                $scope.payee_bank_aba_routing_number = $scope.SettingsData.paymentAdmin.payee_aba_routing_number;
                $scope.payer_int_ref = $scope.SettingsData.paymentAdmin.payer_int_ref;
                $scope.cust_bank_acc_number = $scope.SettingsData.paymentAdmin.cust_bank_acc_number;
                $scope.payer_aba_routing_number = $scope.SettingsData.paymentAdmin.payer_aba_routing_number;
                $scope.payer_swift_id = $scope.SettingsData.paymentAdmin.payer_swift_id;
                $scope.currency = $scope.SettingsData.paymentAdmin.currency;
                $scope.originator_bank_name = $scope.SettingsData.paymentAdmin.originator_bank_name;
                $scope.originator_bank_country = $scope.SettingsData.paymentAdmin.originator_bank_country;
                $scope.payment_charges_borne_by = $scope.SettingsData.paymentAdmin.payment_charges_borne_by;
            });
        }

        //Save Updated Settings
        $scope.setSettingsData = function() {
          $scope.Loading2=true;
          $scope.tempPayeeAddress='';
          $scope.tempPayeeBankAddress='';
          $("#PayeeBankAddressBlock").slideUp("slow");
          $("#PayeeAddressBlock").slideUp("slow");
          document.getElementById("SubTab").style.height = "950px";
            if ($scope.Notifications == "Yes") {
                $scope.SettingsData.invoicedue_notification_flag = true;
            } else {
                $scope.SettingsData.invoicedue_notification_flag = false;
            }
            $scope.SettingsData.invoicedue_notification_frequency = $scope.frequency;
            $scope.SettingsData.paymentAdmin.payment_mode = $scope.payment_mode;
            $scope.SettingsData.paymentAdmin.payee_name = $scope.payee_name;
            $scope.SettingsData.paymentAdmin.payee_address.address1=$scope.payee_address_address1;
            $scope.SettingsData.paymentAdmin.payee_address.address2=$scope.payee_address_address2;
            $scope.SettingsData.paymentAdmin.payee_address.address3=$scope.payee_address_address3;
            $scope.SettingsData.paymentAdmin.payee_address.city=$scope.payee_address_city;
            $scope.SettingsData.paymentAdmin.payee_address.country=$scope.payee_address_country;
            $scope.SettingsData.paymentAdmin.payee_address.postalcode=$scope.payee_address_postalcode;
            $scope.SettingsData.paymentAdmin.payee_address.province=$scope.payee_address_province;
            $scope.SettingsData.paymentAdmin.payee_address.state=$scope.payee_address_state;
            angular.forEach($scope.SettingsData.paymentAdmin.payee_address, function(elm, key) {
                if (elm != null) {
                    $scope.tempPayeeAddress = $scope.tempPayeeAddress + ' ' + elm;
                }
            })
            $scope.payee_address=$scope.tempPayeeAddress;
            $scope.SettingsData.paymentAdmin.payee_bank_name = $scope.payee_bank_name;
            $scope.SettingsData.paymentAdmin.payee_bank_address.address1=$scope.payee_bank_address_address1;
            $scope.SettingsData.paymentAdmin.payee_bank_address.address2=$scope.payee_bank_address_address2;
            $scope.SettingsData.paymentAdmin.payee_bank_address.address3=$scope.payee_bank_address_address3;
            $scope.SettingsData.paymentAdmin.payee_bank_address.city=$scope.payee_bank_address_city;
            $scope.SettingsData.paymentAdmin.payee_bank_address.country=$scope.payee_bank_address_country;
            $scope.SettingsData.paymentAdmin.payee_bank_address.postalcode=$scope.payee_bank_address_postalcode;
            $scope.SettingsData.paymentAdmin.payee_bank_address.province=$scope.payee_bank_address_province;
            $scope.SettingsData.paymentAdmin.payee_bank_address.state=$scope.payee_bank_address_state;
            angular.forEach($scope.SettingsData.paymentAdmin.payee_bank_address, function(elm, key) {
                if (elm != null) {
                    $scope.tempPayeeBankAddress = $scope.tempPayeeBankAddress + ' ' + elm;
                }
            })
            $scope.payee_bank_address=$scope.tempPayeeBankAddress;
            $scope.SettingsData.paymentAdmin.payee_acc_number = $scope.payee_acc_number;
            $scope.SettingsData.paymentAdmin.payee_aba_routing_number = $scope.payee_aba_routing_number;
            $scope.SettingsData.paymentAdmin.payer_int_ref = $scope.payer_int_ref;
            $scope.SettingsData.paymentAdmin.cust_bank_acc_number = $scope.cust_bank_acc_number;
            $scope.SettingsData.paymentAdmin.payer_aba_routing_number = $scope.payer_aba_routing_number;
            $scope.SettingsData.paymentAdmin.payer_swift_id = $scope.payer_swift_id;
            $scope.SettingsData.paymentAdmin.currency = $scope.currency;
            $scope.SettingsData.paymentAdmin.originator_bank_name = $scope.originator_bank_name;
            $scope.SettingsData.paymentAdmin.originator_bank_country = $scope.originator_bank_country;
            $scope.SettingsData.paymentAdmin.payment_charges_borne_by = $scope.payment_charges_borne_by;
            AdminService.updateAdminJson($scope.selectedCustomer, $scope.SettingsData).then(function success(response) {
              if(response.data=="1"){
                $scope.Loading2=false;
                alert("Settings Saved Successfully");
                }
                else{
                  $scope.Loading2=false;
                  alert("Settings Not Saved");
                }
            })
            //$scope.getSettingsData();
            console.log("Outgoing:");
            console.log($scope.SettingsData);
        }
    }]);
});
