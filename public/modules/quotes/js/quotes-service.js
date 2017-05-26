define(['angular', './module', 'constants'], function(angular, module) {
    'use strict';

    /**
     * PredixUserService is a sample service which returns information about the user and if they are logged in
     */
    module.factory('QuotesService', ['$q','$http','urls','$window','$rootScope', function($q,$http,urls,$window,$rootScope) {
        return {
            getQuotesList: function(){
              return $http.get(urls.base_url + urls.get_quotes_list +'?customerId='+$window.sessionStorage.getItem('customerId'), {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
             },
            getQuoteDetails: function(val){
                return $http.get(urls.base_url + urls.get_quote_details+'/'+val+'?customerId='+$window.sessionStorage.getItem('customerId'), {
                   headers: {
                     'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                     'x-access-token': $window.sessionStorage.getItem('userToken')
                   }
                 });
             },
            acceptQuote: function (data) {
              return $http.post(urls.base_url + urls.accept_quote + '?customerId=' +$window.sessionStorage.getItem('customerId'),  data , {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken'),
                   'transformRequest': angular.identity,
                   'Content-Type': undefined
                 }
               });
            },
            acceptQuote1: function (data) {
              return $http.put(urls.base_url + urls.accept_quote + '?customerId=' +$window.sessionStorage.getItem('customerId'),  JSON.stringify(data) , {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
            },
            rejectQuote: function (data) {
              return $http.put(urls.base_url + urls.reject_quote + '?customerId=' +$window.sessionStorage.getItem('customerId'), JSON.stringify(data) , {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
            },
            uploadDocument: function (data) {
              return $http.post(urls.base_url + urls.file_upload + '?customerId=' +$window.sessionStorage.getItem('customerId'), data , {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken'),
                   'transformRequest': angular.identity,
                   'Content-Type': undefined
                 }
               });
            }
        };
    }]);
});
