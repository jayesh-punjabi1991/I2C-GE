define(['angular', './module', 'constants'], function(angular, module) {
    'use strict';

    /**
     * PredixUserService is a sample service which returns information about the user and if they are logged in
     */
    module.factory('DashboardService', ['$q','$http','urls','$window','$rootScope', function($q,$http,urls,$window, $rootScope) {
        return {
            getMyPendingActions: function() {
              console.log('Dashboard '+ $window.sessionStorage.getItem('auth_token'));
              return $http.get(urls.base_url + urls.get_mypending_actions +'/' + $window.sessionStorage.getItem('customerId')+ '/'+ $window.sessionStorage.getItem('roleName'), {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
            }
        };
    }]);
});
