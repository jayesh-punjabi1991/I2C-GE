define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('InvoiceCtrl', ['$scope', 'OrdersService', '$http', '$timeout', '$window', '$filter','$state','$stateParams','InvoiceService','QuotesService', function($scope, OrdersService, $http, $timeout, $window, $filter, $state, $stateParams, InvoiceService, QuotesService) {
      $scope.invoiceNo = $stateParams.invNo;
      $scope.customerId = $stateParams.custId;
      $scope.validateForm = false;
      $scope.uploadButton = true;
      $scope.totalAmount = 0;

      //Loader variables
      $scope.Loading = false; // Validate Loader
      $scope.ULoading = false; // Upload Loader
      $scope.ILoading = true; // Page Loader

      $scope.roleName = $window.sessionStorage.getItem('roleName');
      InvoiceService.getInvoiceDetails($stateParams.invNo, $stateParams.custId).success(function(response){
        console.log(response);
        $scope.invoiceData = response[0];
        if(response[0].supporting_documents != null && response[0].supporting_documents.length != 0){
            $scope.docFlag = true;
            $scope.supporting_documents = response[0].supporting_documents.reverse();
            angular.forEach($scope.supporting_documents, function (value, key) {
              $scope.supporting_documents[key].description = $scope.supporting_documents[key].description.split("_");
            })
        }else{
            $scope.docFlag = false;
        }
        // angular.forEach(response.invoice_lines, function (val, ind) {
        //   val.extended_price = val.extended_price.replace(/\,/g,'');
        //   val.price = val.price.replace(/\,/g,'');
        // })
        $scope.ILoading = false;
      }).error(function(response) {
        $scope.ILoading = false;
      });;
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
      $scope.uploadBtnClicked = function () {
        $scope.uploadButton = false;
        $scope.validateForm = !$scope.validateForm;
      }

      $scope.validateClicked = function () {
        $scope.Loading = true;
        if($scope.supporting_documents != null && $scope.supporting_documents.length != 0){
          console.log('in if');
          $scope.supporting_documents = $scope.supporting_documents.reverse();
          angular.forEach($scope.supporting_documents, function (value, key) {
            $scope.supporting_documents[key].description = $scope.supporting_documents[key].description.join("_");
          })
        }
        console.log($scope.invoiceData);

        InvoiceService.validateInvoice($scope.invoiceNo, $scope.customerId, $scope.invoiceData).success(function (response) {
          alert('Invoice has been validated successfully');
          $scope.Loading = false;
          $state.reload();
        }).error(function (response) {
          $scope.Loading = false;
        });
      }

      $scope.manualUpload = function () {
        $scope.ULoading = true;
        var invD = new FormData();
        console.log("Condition is : " + $scope.supporting_documents != null && $scope.supporting_documents.length != 0);
        if($scope.supporting_documents != null && $scope.supporting_documents.length != 0){
          console.log('in if');
          $scope.supporting_documents = $scope.supporting_documents.reverse();
          angular.forEach($scope.supporting_documents, function (value, key) {
            $scope.supporting_documents[key].description = $scope.supporting_documents[key].description.join("_");
          })
        }
        console.log($scope.invoiceData);
        invD.append('invoiceBody', angular.toJson($scope.invoiceData));

        angular.forEach($scope.files, function(file){
           invD.append('file', file);
        });
        InvoiceService.manualInvoiceUpload($scope.invoiceNo, $scope.customerId, invD).success(function (response) {
          alert('Invoice Uploaded');
          $scope.ULoading = false;
          $state.reload();
        }).error(function (response) {
          $scope.ULoading = false;
        });
      }
    }]);
});
