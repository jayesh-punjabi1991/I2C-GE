define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('PaymentDetailsCtrl', ['$scope', '$http', '$timeout', '$window', '$filter','PaymentService','$state','$stateParams','InvoiceService', function($scope, $http, $timeout, $window, $filter, PaymentService, $state, $stateParams, InvoiceService) {
      $scope.invoiceNumber = $stateParams.no;

      $scope.PLoading = false; //  Dispute Loader
      $scope.ILoading = true; // Page Loader

      $scope.roleName = $window.sessionStorage.getItem('roleName');
      InvoiceService.getInvoiceDetails($scope.invoiceNumber).success(function(response){
        console.log(response);
        $scope.invoiceData = response[0];
        $scope.paymentData = response[1].paymentAdmin;
        $scope.description = $scope.invoiceNumber + '--' + $scope.invoiceData.customer_number;
        if(response[0].supporting_documents != null && response[0].supporting_documents.length != 0){
            $scope.docFlag = true;
            $scope.supporting_documents = response[0].supporting_documents.reverse();
            angular.forEach($scope.supporting_documents, function (value, key) {
              $scope.supporting_documents[key].description = $scope.supporting_documents[key].description.split("_");
            })
        }else{
            $scope.docFlag = false;
        }
        $scope.ILoading = false;
      });

      function convertToBlob(response) {
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
      }
      $scope.displayFile = function (type, fileName) {
        if(type == "EXTERNAL"){
          InvoiceService.viewDocument(fileName).success(function(response){
            convertToBlob(response);
          });
        }else{
          QuotesService.viewDocument(fileName).success(function(response) {
            convertToBlob(response);
          })
        }
      }
    }]);
});
