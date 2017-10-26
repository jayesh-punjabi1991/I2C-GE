define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('PaymentCtrl', ['$scope', '$http', '$timeout', '$window', '$filter','InvoiceService','PaymentService','$state', function($scope, $http, $timeout, $window, $filter, InvoiceService, PaymentService, $state) {
      // tabs logic
      $('#tab-ul #selected').addClass('div-visible');
        $('#tab-ul li').on('click',function(){
            var i =$(this).parent().children().index(this);
            var liItem=$(this)[0];
            $(".selected-tab").removeClass("selected-tab");
            $(liItem).addClass('selected-tab');
            var divItem=$('#content').children()[i];
            $('.div-visible').addClass('div-invisible');
            $(divItem).removeClass('div-invisible');
            $(divItem).addClass('div-visible');

        });
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
        window.sortbydate1= function(a, b) {
          if(this.descending) {
            if(new Date(a.value.substr(20,a.value.indexOf('</div>')-20)) < new Date(b.value.substr(20,a.value.indexOf('</div>')-20))) {
              return 1;
            }
            return -1;
          }
          else {
            if(new Date(a.value.substr(20,a.value.indexOf('</div>')-20)) > new Date(b.value.substr(20,a.value.indexOf('</div>')-20))) {
              return 1;
            }
            return -1;
          }
        }
        $scope.invoiceClicked = true;
        $scope.invoiceFlag = true;
        $scope.paymentFlag = false;
        $scope.InvoiceList = [];
        $scope.DueList = [];
        $scope.PaymentList = [];
        $scope.roleName = $window.sessionStorage.getItem('roleName');

        $scope.ILoading = true;
        $scope.PLoading = true;

        var date = new Date();
        var today = date.getTime();
        InvoiceService.getInvoiceList().success(function (response) {
          console.log(response);
          angular.forEach(response, function (value, key) {
            getInvoices(value.invoices, value.custId)
          });
          $scope.ILoading = false;
        }).then(function () {
          payments();
        });

        function payments() {
          PaymentService.getPaymentList().success(function (response) {
            console.log(response);
            $scope.paymentData = response;
            angular.forEach(response, function (value, key) {
              getPayments(value.payments, value.custId)
            });
            $scope.PLoading = false;
          });
        }

        function getInvoices(invoiceData, custId) {
          angular.forEach(invoiceData, function (value, key) {
            var datediff = Math.round((new Date(parseInt(value.invoice_due_date)*1000) - today)/(1000*60*60*24));
            console.log(value.invoice_due_date);
            console.log(datediff);
            if(datediff > 5){
              $scope.InvoiceList.push({
                'invoiceNo':'<a href="/payment/invoiceDetails/'+ custId +'/'+value.invoice_number+'">'+value.invoice_number+'</a>',
                'orderNo': value.ge_order_number,
                'custId': custId,
                'custName': value.customer_name.substring(0,15) + '...',
                'status': value.status,
                'dueAmt': $filter('currency')(value.balance_amt,'', 2) + '/ ' + $filter('currency')(value.total_invoice_amt_with_tax,'', 2),
                'dueDate' : '<div class="green-bg">'+ $filter('date')(new Date(parseInt(value.invoice_due_date) * 1000), 'MMM dd, yyyy') +'</div>',
                'invoice_due_date':value.invoice_due_date
              });
            }else if(datediff <= 5 && datediff >= 0){
              if(value.status != 'paid' && value.balance_amt > 0){
                $scope.DueList.push({
                  'invoiceNo':'<a href="/payment/invoiceDetails/'+ custId +'/'+value.invoice_number+'">'+value.invoice_number+'</a>',
                  'orderNo': value.ge_order_number,
                  'custId': custId,
                  'custName': value.customer_name.substring(0,15) + '...',
                  'status': value.status,
                  'dueAmt': $filter('currency')(value.balance_amt,'', 2) + '/ ' + $filter('currency')(value.total_invoice_amt_with_tax,'', 2),
                  'dueDate' : '<div class="yellow-bg">'+ $filter('date')(new Date(parseInt(value.invoice_due_date) * 1000), 'MMM dd, yyyy') +'</div>',
                  'invoice_due_date':value.invoice_due_date
                });
              }
              $scope.InvoiceList.push({
                'invoiceNo':'<a href="/payment/invoiceDetails/'+ custId +'/'+value.invoice_number+'">'+value.invoice_number+'</a>',
                'orderNo': value.ge_order_number,
                'custId': custId,
                'custName': value.customer_name.substring(0,15) + '...',
                'status': value.status,
                'dueAmt': $filter('currency')(value.balance_amt,'', 2) + '/ ' + $filter('currency')(value.total_invoice_amt_with_tax,'', 2),
                'dueDate' : '<div class="yellow-bg">'+ $filter('date')(new Date(parseInt(value.invoice_due_date) * 1000), 'MMM dd, yyyy') +'</div>',
                'invoice_due_date':value.invoice_due_date
              });
            }else if(datediff < 0){
              if(value.status != 'paid' && value.balance_amt > 0){
                $scope.DueList.push({
                  'invoiceNo':'<a href="/payment/invoiceDetails/'+ custId +'/'+value.invoice_number+'">'+value.invoice_number+'</a>',
                  'orderNo': value.ge_order_number,
                  'custId': custId,
                  'custName': value.customer_name.substring(0,15) + '...',
                  'status': value.status,
                  'dueAmt': $filter('currency')(value.balance_amt,'', 2) + '/ ' + $filter('currency')(value.total_invoice_amt_with_tax,'', 2),
                  'dueDate' : value.status == 'paid' ? $filter('date')(new Date(parseInt(value.invoice_due_date) * 1000), 'MMM dd, yyyy') : '<div class="red-bg">'+ $filter('date')(new Date(parseInt(value.invoice_due_date) * 1000), 'MMM dd, yyyy') +'</div>',
                  'invoice_due_date':value.invoice_due_date
                });
              }
              $scope.InvoiceList.push({
                'invoiceNo':'<a href="/payment/invoiceDetails/'+ custId +'/'+value.invoice_number+'">'+value.invoice_number+'</a>',
                'orderNo': value.ge_order_number,
                'custId': custId,
                'custName': value.customer_name.substring(0,15) + '...',
                'status': value.status,
                'dueAmt': $filter('currency')(value.balance_amt,'', 2) + '/ ' + $filter('currency')(value.total_invoice_amt_with_tax,'', 2),
                'dueDate' : value.status == 'paid' ? $filter('date')(new Date(parseInt(value.invoice_due_date) * 1000), 'MMM dd, yyyy') : '<div class="red-bg">'+ $filter('date')(new Date(parseInt(value.invoice_due_date) * 1000), 'MMM dd, yyyy') +'</div>',
                'invoice_due_date':value.invoice_due_date
              });
            }
          });
          $scope.InvoiceList=$filter("orderBy")($scope.InvoiceList,"invoice_due_date");
          $scope.DueList=$filter("orderBy")($scope.DueList,"invoice_due_date");
        }

        function getPayments(paymentData, custId) {
          angular.forEach(paymentData, function (value, key) {
            $scope.PaymentList.push({
              "payment_id" : value.payment_id,
              "payee_bank_name":value.payee_bank_name,
              'payee_acc_number': value.payee_acc_number,
              'payer_int_ref': value.payer_int_ref,
              'payment_description': value.payment_description.length > 40 ? value.payment_description.substring(0, 40) + '...' : value.payment_description,
              'payment_date': $filter('date')(new Date(parseInt(value.payment_date*1000)), 'MMM dd, yyyy'),
              'payment_amount' : $filter('currency')(value.payment_amount, value.currency + ' ', 2),
              'status' : value.status,
              'action' : value.status != 'completed' ? '<button class="btn btn-primary Custom">Payment</br> Received</button>' : '',
              'custId' : custId,
              'payId' : value.payment_id,
              'paydate':value.payment_date
            });
          });
          $scope.PaymentList=$filter("orderBy")($scope.PaymentList,"paydate");
        }

        document.getElementById("paymentsTable").addEventListener("px-cell-click", function(e) {
          var clickedRow = e.detail.row;
          var clickedCol = e.detail.column.className;
          console.log("Cell clicked: ", clickedRow);
          if(clickedCol == 'paymentReceived'){
            angular.forEach($scope.paymentData, function (value, key) {
              if(value.custId == clickedRow.row.custId.value){
                angular.forEach(value.payments, function (elm, ind) {
                  if(elm.payment_id == clickedRow.row.payId.value){
                    console.log('in 2');
                    $scope.payData = elm;
                  }
                })
              }
            })
            completePayment($scope.payData, clickedRow.row.payId.value, clickedRow.row.custId.value);
          }
        });

        function completePayment(payData, pId, custId) {
          console.log(pId);
          console.log(custId);
          PaymentService.paymentComplete(pId, custId, payData).success(function (response) {
            alert('Payment Status Updated');
            $state.reload();
          })
        }
    }]);
});
