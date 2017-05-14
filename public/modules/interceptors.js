/**
 * Router Config
 * This is the router definition that defines all application routes.
 */
define(['angular'], function (angular) {
    'use strict';
    /**
     * Application configurations
     * This is where configuration is setup for your application.
     */
    return angular.module('app.interceptors', []).config(['$httpProvider', function ($httpProvider) {

        /*
         * Application http interceptor configuration
         * If you are using Siteminder, this interceptor can be used to capture the session timeout on an AJAX request.
         * You can implement your conditions in this interceptor according to your own requirement.
         */
        $httpProvider.interceptors.push(['$q','$location','$rootScope','$window', function ($q, $location, $rootScope, $window) {
            return {
                // optional method
                'request': function (config) {
                    //console.log($location.path());
                    if($location.path() != '/userInfo' || $location.path() != '/fetchToken')
                    //console.log('interceptor');
                    var access_token = $rootScope.auth_token;
                    if($rootScope.auth_token){
                      config.headers['Authorization'] = 'Bearer ' + access_token;
                      config.headers['x-access-token'] = $window.sessionStorage.getItem('userToken');
                    }
                    return config;
                },
                // optional method
                'requestError': function (rejection) {
                    //handle error
                    return $q.reject(rejection);
                },
                // optional method
                'response': function (response) {
                    // do something on success
                    return response;
                },
                // (optional) Redirect user to login page when unauthorized (401)
                // If you want to allow 401's, you can remove this method.
                'responseError': function (rejection) {
                    // handle error
                    if(rejection.status >= 400){
                      alert(rejection.status+"-"+rejection.data.error+" : "+rejection.data.message);
                    }
                    return $q.reject(rejection);
                }
            };
        }]);
    }]);
});
