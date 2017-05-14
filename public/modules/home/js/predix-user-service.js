define(['angular', './module', 'constants'], function(angular, module) {
    'use strict';

    /**
     * PredixUserService is a sample service which returns information about the user and if they are logged in
     */
    module.factory('PredixUserService', ['$q','$http','urls','$window','$rootScope', function($q,$http,urls,$window,$rootScope) {
        return {
            isAuthenticated: function() {
                return this.getUserInfo();
            },
            login: function(uiState) {
                window.px.auth.login(uiState);
            },
            getUserInfo: function() {
                var deferred = $q.defer();
                window.px.auth.getUserInfo().then(function(userInfo) {
                    deferred.resolve(userInfo);
                }, function() {
                    deferred.reject();
                });
                return deferred.promise;
            },
            fetchToken: function() {
                return $http({ method: 'GET', url: urls.base_url + urls.fetch_token});
            },
            getUserDetails: function(data) {
                return $http.post(urls.base_url + urls.get_user_details, JSON.stringify({'userInputVO':data}),{
                  headers: {
                    'Authorization': 'bearer ' + $window.sessionStorage.getItem('auth_token'),
                    'x-access-token': $window.sessionStorage.getItem('userToken')
                  }
                });
            }
        };
    }]);
});
