define(['angular', './module', 'constants'], function(angular, module) {
    'use strict';

    /**
     * PredixUserService is a sample service which returns information about the user and if they are logged in
     */
    module.factory('CrService', ['$q','$http','urls','$window','$rootScope', function($q,$http,urls,$window,$rootScope) {
        return {
            getCrList: function(){
              //return $http.get('modules/changeRequest/json/ChangeRequestList.json')
              return $http.get(urls.base_url + urls.get_Cr_List, {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
             },
             getCrDetails: function(crNo,custId){
               //return $http.get('modules/changeRequest/json/ChangeRequestList.json')
               return $http.get(urls.base_url + urls.get_Cr_details+'/'+ crNo +'?custId='+custId, {
                  headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                    'x-access-token': $window.sessionStorage.getItem('userToken')
                  }
                });
              }
        };
    }]);
});
