define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('AuditCtrl', ['$scope', '$log', '$timeout', 'OrdersService', '$http', 'PredixUserService', '$window', '$filter', '$state','$stateParams', function($scope, $log, $timeout, OrdersService, $http, PredixUserService, $window, $filter, $state, $stateParams) {

      $scope.Loading = true;
      $scope.PLoading = false;
      $scope.versionList = ['1','2','3','4','5'];
      $scope.invoiceList = ['9834934','9239823','9283797','8923798'];
      $scope.invoices = [];
      $scope.paymentList = [];
      $scope.disputeList = [];
      $scope.orderNumber = $stateParams.id;
      $scope.customerId = $stateParams.custId;
      var count = 1;
      OrdersService.getOrderAuditRecords($stateParams.id, $stateParams.custId).success(function (response) {
        console.log(response);
        $scope.versionList = response.orderHistory;
        $scope.versionLength = $scope.versionList ? $scope.versionList.length : 0;
        $scope.invoiceList = response.invoiceHistory[0].invoices;
        $scope.invoiceLength = $scope.invoiceList ? $scope.invoiceList.length : 0;
        $scope.crList = response.crHistory[0].crs;
        angular.forEach($scope.crList,  function (value, key) {
          value.cr_link = "<a href='/changeRequest/Accepted/" +$scope.customerId+'/'+ value.change_req_id + "'>" + value.change_req_id + "</a>";
          value.cr_status = value.status === "accepted" ? "<div class='status_accept'></div>" + value.status  : value.status === "rejected" ? "<div class='status_reject'></div>" + value.status: "<div class='status_pending'></div>" + value.status;
          value.cr_date_format = $filter('date')(new Date(parseInt(value.cr_date)*1000), 'MMM dd, yyyy')
        });
        if($scope.invoiceLength > 0){
            $scope.getPayments($scope.invoiceList[0].invoice_number);
        }
        $scope.Loading = false;
      });

      $('.tabular.menu .item').tab();

      $scope.getPayments = function (x) {
        $scope.PLoading = true;
        OrdersService.getInvoiceAuditRecords(x, $scope.customerId).success(function (response) {
          console.log(response);
          $scope.paymentList.push(response.paymentHistory[0].payments);
          $scope.disputeList.push(response.disputeHistory[0].disputes);
          if(count < $scope.invoiceLength){
            $scope.getPayments($scope.invoiceList[count].invoice_number);
          }else if(count == $scope.invoiceLength){
            $scope.PLoading = false;
          }
          count++;
        })
      }

      $scope.viewVersions = function (x) {
        OrdersService.setOrderData({'data': x});
      }



    }]);
});
