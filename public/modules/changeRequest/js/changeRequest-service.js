define(['angular', './module', 'constants'], function(angular, module) {
    'use strict';

    /**
     * PredixUserService is a sample service which returns information about the user and if they are logged in
     */
    module.factory('CrService', ['$q', '$http', 'urls', '$window', '$rootScope', function($q, $http, urls, $window, $rootScope) {
        return {
            getCrList: function() {
                //return $http.get('modules/changeRequest/json/ChangeRequestList.json')
                return $http.get(urls.base_url + urls.get_Cr_List, {
                    headers: {
                        'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                        'x-access-token': $window.sessionStorage.getItem('userToken')
                    }
                });
            },
            getCrListByDate: function(){
              return $http.get(urls.base_url + urls.get_Cr_List_date +'/'+$window.sessionStorage.getItem('fromDate')+'/'+$window.sessionStorage.getItem('toDate')+'/CR', {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
             },
            getCrDetails: function(crNo, custId) {
                //return $http.get('modules/changeRequest/json/ChangeRequestList.json')
                return $http.get(urls.base_url + urls.get_Cr_details + '/' + crNo + '?custId=' + custId, {
                    headers: {
                        'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                        'x-access-token': $window.sessionStorage.getItem('userToken')
                    }
                });
            },
            getCrDiffDetails: function(val, custId){
              //return $http.get('modules/changeRequest/json/ChangeRequestList.json')
              return $http.get(urls.base_url + urls.get_Cr_diff_details+'/'+ val +'?custId='+custId, {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
             },
            acceptCR: function(crNo,custId, data) {
              return $http.post(urls.base_url + urls.accept_CR+'/'+ crNo +'?custId='+custId, JSON.stringify(data), {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
            },
            rejectCR: function(crNo,custId, data) {
              return $http.post(urls.base_url + urls.reject_CR+'/'+ crNo +'?custId='+custId, JSON.stringify(data), {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
            },
            approveOrder: function(oNo,custId, data) {
              return $http.put(urls.base_url + urls.approve_order+'/'+ oNo +'?custId='+custId, JSON.stringify(data), {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
            }
        };
    }]);
});
