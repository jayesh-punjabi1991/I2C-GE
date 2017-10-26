define(['angular', './module', 'constants'], function(angular, module) {
    'use strict';

    /**
     * PredixUserService is a sample service which returns information about the user and if they are logged in
     */
    module.factory('InvoiceService', ['$q','$http','urls','$window','$rootScope', function($q,$http,urls,$window,$rootScope) {
        return {
            getInvoiceList: function(){
              return $http.get(urls.base_url + urls.get_invoice_list, {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
             },
            getInvoiceDetails: function(invNo, custId){
              return $http.get(urls.base_url + urls.get_invoice_details + '/' + invNo + '?custId=' + custId, {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
             },
             getInvoiceListBySubOrder: function(oId, soId, custId) {
               return $http.get(urls.base_url + urls.get_invoice_list_by_suborder + '?custId=' + custId + '&filterBy=order_no&value=' + oId + '&subOrderId=' + soId, {
                  headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                    'x-access-token': $window.sessionStorage.getItem('userToken')
                  }
                });
             },
             validateInvoice: function(invNo, custId, data) {
               return $http.post(urls.base_url + urls.validate_invoice + '/'+ invNo + '?custId=' + custId , angular.toJson(data) , {
                  headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                    'x-access-token': $window.sessionStorage.getItem('userToken')
                  }
                });
             },
             manualInvoiceUpload: function(invNo, custId, data) {
               return $http.post(urls.base_url + urls.manual_inv_upload + '/'+ invNo + '?custId=' + custId , data , {
                  headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                    'x-access-token': $window.sessionStorage.getItem('userToken'),
                    'transformRequest': angular.identity,
                    'Content-Type': undefined
                  }
                });
             },
             initiateDispute: function(invNo, custId, data) {
               return $http.post(urls.base_url + urls.validate_invoice + '/'+ invNo + '?custId=' + custId , angular.toJson(data) , {
                  headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                    'x-access-token': $window.sessionStorage.getItem('userToken'),
                  }
                });
             },
            viewDocument: function (invNo) {
              return $http.get(urls.base_url + urls.download_invoice + '?invoiceNo=' + invNo, {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token')
                 }
               },{responseType : 'arraybuffer'});
            }
        };
    }]);
});
