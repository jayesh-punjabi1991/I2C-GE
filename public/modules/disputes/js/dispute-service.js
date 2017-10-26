define(['angular', './module', 'constants'], function(angular, module) {
    'use strict';

    /**
     * PredixUserService is a sample service which returns information about the user and if they are logged in
     */
    module.factory('DisputeService', ['$q','$http','urls','$window','$rootScope', function($q,$http,urls,$window,$rootScope) {
        return {
            getDisputesList: function(){
              return $http.get(urls.base_url + urls.get_disputes_list, {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
             },
             getDisputesListByDate: function(){
               return $http.get(urls.base_url + urls.get_disputes_list_date +'/'+$window.sessionStorage.getItem('fromDate')+'/'+$window.sessionStorage.getItem('toDate')+'/DISPUTE', {
                  headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                    'x-access-token': $window.sessionStorage.getItem('userToken')
                  }
                });
              },
              getDisputeDetails: function(val,custId){
                  return $http.get(urls.base_url + urls.get_dispute_details+'/'+ val+ '?custId='+custId, {
                     headers: {
                       'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                       'x-access-token': $window.sessionStorage.getItem('userToken')
                     }
                   });
               },
               viewDocument: function (invNo) {
                 return $http.get(urls.base_url + urls.download_invoice + '?invoiceNo=' + invNo, {
                    headers: {
                      'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token')
                    }
                  },{responseType : 'arraybuffer'});
               },
               acceptDispute: function(disputeNo,custId, data) {
                 return $http.put(urls.base_url + urls.accept_Dispute+'/'+ disputeNo +'?custId='+custId, angular.toJson(data), {
                    headers: {
                      'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                      'x-access-token': $window.sessionStorage.getItem('userToken')
                    }
                  });
               },
               rejectDispute: function(disputeNo,custId, data) {
                 return $http.put(urls.base_url + urls.reject_Dispute+'/'+ disputeNo +'?custId='+custId, angular.toJson(data), {
                    headers: {
                      'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                      'x-access-token': $window.sessionStorage.getItem('userToken')
                    }
                  });
               }
        };
    }]);
});
