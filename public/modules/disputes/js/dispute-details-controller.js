define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('DisputeDetailsCtrl', ['$scope','DisputeService','QuotesService', '$log', '$timeout', '$http', '$state', '$stateParams','$window','$filter', function($scope,DisputeService,QuotesService, $log, $timeout, $http, $state, $stateParams, $window, $filter) {
      $scope.disputeNumber = $stateParams.id;
      $scope.custId= $stateParams.custId;
      $scope.rejectBtn = false;
      $scope.rejectBtn1=false;
      $scope.showTextInput = false;
      $scope.Validation2 = false;
      $scope.Validation3 = false;
      $scope.Loading=true;
        DisputeService.getDisputeDetails($stateParams.id,$stateParams.custId).then(function success(response) {
          $scope.Loading=false;
          console.log(response);
          $scope.dispute=response.data;
          $scope.dispute_id=response.data.dispute_id;
          $scope.invoice_number=response.data.invoice_number;
          $scope.ge_order_number=response.data.ge_order_number;
          $scope.invoice_date=new Date(response.data.invoice.invoice_date*1000);
          $scope.invoice_status=response.data.invoice.status;
          $scope.dispute_status=response.data.status;
          $scope.invoiceData = response.data.invoice;
          $scope.To=response.data.to;
          $scope.From=response.data.from;
          $scope.description=response.data.description;
          $scope.comments = response.data.comments;
          $scope.OrderLink="/orderDetails/"+$scope.custId+"/"+$scope.ge_order_number;

          if(response.data.supporting_documents != null && response.data.supporting_documents.length != 0){
              $scope.docFlag1 = true;
              $scope.supporting_documents1 = response.data.supporting_documents;
          }else{
              $scope.docFlag1 = false;
          }

          if($scope.invoiceData.supporting_documents != null && $scope.invoiceData.supporting_documents.length != 0){
              $scope.docFlag = true;
              $scope.supporting_documents = $scope.invoiceData.supporting_documents.reverse();
              angular.forEach($scope.supporting_documents, function (value, key) {
                $scope.supporting_documents[key].description = $scope.supporting_documents[key].description.split("_");
              })
          }else{
              $scope.docFlag = false;
          }

        })

        $scope.displayFile = function (type, fileName) {
          if(type == "EXTERNAL"){
            DisputeService.viewDocument(fileName).success(function(response){
              convertToBlob(response);
            });
          }else{
            QuotesService.viewDocument(fileName).success(function(response) {
              convertToBlob(response);
            })
          }
        }
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

        $scope.acceptClicked=function(){
          $scope.Loading=true;
          var disputeDocs = $scope.dispute.supporting_documents;

          //----Ask
          // var length = Object.keys($scope.dispute.supporting_documents).length;
          // disputeDocs[Object.keys($scope.dispute.supporting_documents).length] = {
          //     'document_type':'link',
          //     'description':$scope.dispute,
          //     'url':$scope.ltrLink,
          //     'hash':''
          // };

          var dispute = {
              'from': $scope.dispute.from,
              'to': $scope.dispute.to,
              'cc': $scope.dispute.cc,
              'subject': $scope.dispute.subject,
              'description': $scope.dispute.description,
              'dispute_date': $scope.dispute.dispute_date,
              'dispute_id': $scope.dispute.dispute_id,
              'invoice_number': $scope.dispute.invoice_number,
              'ge_order_number': $scope.dispute.ge_order_number,
              'sub_order_id': $scope.dispute.sub_order_id,
              'status': $scope.dispute.status,
              'supporting_documents': disputeDocs,
              'tc_invoice_version': $scope.dispute.tc_invoice_version
          };
          console.log(dispute);
          DisputeService.acceptDispute($scope.dispute_id,$scope.custId,dispute).success(function(response) {
            $scope.Loading=false;
            alert("Dispute# "+$scope.dispute_id+" accepted successfully.");
            $state.reload();
          })
        }

        $scope.rejectClicked=function(){
          if($scope.Validation3==true){
          $scope.Loading=true;

          var disputeDocs = $scope.dispute.supporting_documents;
          //----Ask
          // var length = Object.keys($scope.dispute.supporting_documents).length;
          // disputeDocs[Object.keys($scope.dispute.supporting_documents).length] = {
          //     'document_type':'link',
          //     'description':'Dispute_link',
          //     'url':$scope.ltrLink,
          //     'hash':''
          // };

          var dispute = {
              'from': $scope.dispute.from,
              'to': $scope.dispute.to,
              'cc': $scope.dispute.cc,
              'subject': $scope.dispute.subject,
              'description': $scope.dispute.description,
              'dispute_date': $scope.dispute.dispute_date,
              'dispute_id': $scope.dispute.dispute_id,
              'invoice_number': $scope.dispute.invoice_number,
              'ge_order_number': $scope.dispute.ge_order_number,
              'sub_order_id': $scope.dispute.sub_order_id,
              'status': $scope.dispute.status,
              'supporting_documents': disputeDocs,
              'tc_invoice_version': $scope.dispute.tc_invoice_version,
              'comments': $scope.rej_comment
          };
          console.log(dispute);

          DisputeService.rejectDispute($scope.dispute_id,$scope.custId,dispute).success(function(response) {
            alert("Dispute# "+$scope.dispute_id+" rejected successfully.");
            $scope.Loading=false;
            $state.reload();
          })
        }
        else{
          alert("Please fill out the mandatory fields");
        }
        }
        $scope.DisableReject = function() {
            var d = document.getElementById("rejectButton2");
            d.className += " disabled";
            d.classList.remove("btn-reject");
        }
        $scope.enableReject = function() {
            var d = document.getElementById("rejectButton2");
            d.className += " btn btn-reject";
            d.classList.remove("disabled");
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
                    $scope.rejectBtn1=true;
                    //alert("Done");
                }
            });
          $scope.rejectBtn = true;
          $scope.acceptdisable=true;
          $scope.showTextInput = true;

        }

    }]);
});
