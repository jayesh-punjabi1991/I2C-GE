define(['angular', './module', 'constants'], function(angular, module) {
    'use strict';

    /**
     * PredixUserService is a sample service which returns information about the user and if they are logged in
     */
    module.factory('AdminService', ['$q', '$http', 'urls', '$window', '$rootScope', function($q, $http, urls, $window, $rootScope) {

        return {
            uploadInvoice: function(data) {
                return $http.post(urls.base_url + urls.upload_invoice, data, {
                    headers: {
                        'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                        'transformRequest': angular.identity,
                        'Content-Type': undefined
                    }
                });
            },
            getInvoiceLogs: function(data) {
                return $http.get(urls.base_url + urls.get_invoice_logs, {
                    headers: {
                        'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token')
                    }
                });
            },
            processInvoice: function(id) {
                return $http.get(urls.base_url + urls.process_invoice + '/' + id, {
                    headers: {
                        'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token')
                    }
                });
            },
            fetchAdminJson: function(cust) {
                //return $http.get("modules/admin/json/data.json");
                 return $http.get(urls.base_url + urls.fetch_admin + '/' + cust, {
                   //return $http.get("http://3.206.228.73:9004/tcaapigateway/fetchAdminJson/hca", {
                    headers: {
                      'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token')
                    }
                  });
            },
            updateAdminJson: function(cust, data) {
                return $http.post(urls.base_url + urls.update_admin + '/' + cust, data, {
                    headers: {
                        'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token')
                    }
                });
            }
        }
    }]);
});
