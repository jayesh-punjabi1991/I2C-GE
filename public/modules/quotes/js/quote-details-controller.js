define(['angular', './module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('QuoteDetailsCtrl', ['$scope', '$log','$timeout','QuotesService','$http','$state','$stateParams','PredixUserService', function ($scope, $log,$timeout,QuotesService,$http,$state,$stateParams,PredixUserService) {
      QuotesService.getQuoteDetails($stateParams.id).then(function success(response){
        console.log(response);
        $scope.quoteData = response.data;
        $scope.customerId = response.data.customerId;
        $scope.QuoteNumber=response.data.quote_number;
        $scope.QuoteDate=response.data.quote_date;
        $scope.QuoteVersion=response.data.quote_version;
        $scope.QuoteStatus=response.data.status;
        $scope.BillingTerms=response.data.billing_terms;
        $scope.DeliveryTerms=response.data.delivery_terms;
        $scope.ShipToAddress1=response.data.ship_to.address1;
        $scope.ShipToAddress2=response.data.ship_to.address2;
        $scope.ShipToAddress3=response.data.ship_to.address3;
        $scope.ShipToCity=response.data.ship_to.city;
        $scope.ShipToCountry=response.data.ship_to.country;
        $scope.ShipToPostalCode=response.data.ship_to.postalCode;
        $scope.ShipToProvince=response.data.ship_to.province;
        $scope.ShipToState=response.data.ship_to.state;
        $scope.BillToAddress1=response.data.bill_to.address1;
        $scope.BillToAddress2=response.data.bill_to.address2;
        $scope.BillToAddress3=response.data.bill_to.address3;
        $scope.BillToCity=response.data.bill_to.city;
        $scope.BillToCountry=response.data.bill_to.country;
        $scope.BillToPostalCode=response.data.bill_to.postalCode;
        $scope.BillToProvince=response.data.bill_to.province;
        $scope.BillToState=response.data.bill_to.state;
        $scope.poNumber = $scope.poNumber;
        $scope.CustomerAccountNumber = response.data.customer_acc_number;
        $scope.POAmount = response.data.purchase_order_amount;
        $scope.paymentTerms = response.data.payment_terms;
        $scope.partNumber = response.data.quoteLines[0].partNumber;
        $scope.partDesc = response.data.quoteLines[0].lineItemDescription;
        $scope.sellingPrice = response.data.quoteLines[0].sellingPrice;
        $scope.listPrice = response.data.quoteLines[0].listPrice;
        $scope.quantity = response.data.quoteLines[0].quantity;
        $scope.discountPerc = response.data.quoteLines[0].discountPerc;
        $scope.partsList = [];
        $scope.itemDetails = [];
        angular.forEach(response.data.quoteLines,function(value,key){
          $scope.partsList.push({
            'qty': value.quantity,
            'desc': value.lineItemDescription,
            'cPrice': value.list_price,
            'disc': value.discount_perc,
            'sPrice': value.selling_price
          });
          $scope.itemDetails.push({
            'qty': value.quantity,
            'desc': value.lineItemDescription,
            'cPrice': value.list_price,
            'disc': value.discount_perc,
            'sPrice': value.selling_price,
            'itemNo': value.part_number
          });
        });
      });
      $scope.acceptDetails1=true;
      $scope.enableAccept=function(){
        var d = document.getElementById("AcceptButton");
        d.className += " btn btn-primary";
        d.classList.remove("disabled");
      }

      $scope.acceptClicked = function () {
        var d = document.getElementById("AcceptButton");
        var d1 = document.getElementById("RejectButton");
        d.className += " disabled";
        d1.className += " disabled";

        var acceptData = $scope.quoteData;
        // var fd = new FormData();
        // angular.forEach($scope.files, function(file){
        //   fd.append('file', file);
        // });
        //console.log($scope.files);

        acceptData.bill_to = {
          'address1':  $scope.BillTo,
          'address2': '',
          'address3': '',
          'city':''
        };
        //acceptData.bill_to = $scope.BillTo;
        acceptData.poNumber = $scope.PONumber;
        //fd.append('quoteInputVO', JSON.stringify(acceptData));
        // for (var pair of fd.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]);
        // };
        //console.log(fd);
        // QuotesService.acceptQuote(fd).success(function (response) {
        //   $scope.successMessage = true;
        //   //alert(response);
        // });
        QuotesService.acceptQuote1(acceptData).success(function (response) {
          $scope.successMessage = true;
          alert(response);
        });

      };

      $scope.rejectClicked = function () {
        var d = document.getElementById("AcceptButton");
        var d1 = document.getElementById("RejectButton");
        d.className += " disabled";
        d1.className += " disabled";

        var rejectData = $scope.quoteData;
        rejectData.comment = $scope.comments;
        console.log(rejectData);

         QuotesService.rejectQuote(rejectData).success(function (response) {
           $scope.AcknowledgeReject=true;
           $scope.rejectDetails=false;
           //alert('Quote rejected');
         });
      }
    }]);
});
