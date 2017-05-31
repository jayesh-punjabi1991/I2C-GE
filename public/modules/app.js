/**
 * Load controllers, directives, filters, services before bootstrapping the application.
 * NOTE: These are named references that are defined inside of the config.js RequireJS configuration file.
 */
define([
    'jquery',
    'angular',
    'main',
    'routes',
    'constants',
    'interceptors',
    'px-datasource',
    'ng-bind-polymer',
    'angularUtils.directives.dirPagination'
], function ($, angular) {
    'use strict';

    /**
     * Application definition
     * This is where the AngularJS application is defined and all application dependencies declared.
     * @type {module}
     */
    var predixApp = angular.module('predixApp', [
        'home',
        'quotes',
        'orders',
        'changeRequest',
        'app.routes',
        'app.constants',
        'app.interceptors',
        'predix.datasource',
        'px.ngBindPolymer',
        'angularUtils.directives.dirPagination'
    ]);

    /**
     * Main Controller
     * This controller is the top most level controller that allows for all
     * child controllers to access properties defined on the $rootScope.
     */
    predixApp.controller('MainCtrl', ['$scope', '$rootScope','PredixUserService','$location','$window','$state', function ($scope, $rootScope, predixUserService, $location, $window, $state) {

        $scope.tags = [];
        $rootScope.userName = $window.sessionStorage.getItem('userName');
        $rootScope.userRole = $window.sessionStorage.getItem('roleName');
        if($rootScope.userRole == 'ge-oms'){
          $scope.tags = [
              {icon: 'fa-home fa-2x', state: 'dashboards', label: 'Home'},
              {icon: 'fa-truck fa-2x', state: 'orders', label: 'Orders'},
              {icon: 'fa-pencil-square-o fa-2x', state: 'changeRequest', label: 'Change Request'}
              // {icon: 'fa-gavel fa-2x', state: '', label: 'Disputes'}
          ]
        }else if($rootScope.userRole == 'ge-sales'){
          $scope.tags = [
              {icon: 'fa-home fa-2x', state: 'dashboards', label: 'Home'},
              {icon: 'fa-file-text-o fa-2x', state: 'quotes', label: 'Quotes'}
          ]
        }
        //Global application object
        window.App = $rootScope.App = {
            version: '1.0',
            name: 'Predix Seed',
            session: {},
            tabs: $scope.tags
        };


        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, error) {
            //console.log('on state change');
            if (!$window.sessionStorage.getItem('auth_token') && $location.path() != '/home') {
              //console.log('in if');

              predixUserService.isAuthenticated().then(function (userInfo) {
                console.log(userInfo);
                $window.sessionStorage.setItem('userName',userInfo.user_name);
                $window.sessionStorage.setItem('userEmail',userInfo.email);
                $window.sessionStorage.setItem('userToken',userInfo.user_token);

                $rootScope.userName = userInfo.user_name;

                predixUserService.fetchToken().success(function (response) {
                    if(response){
                        $window.sessionStorage.setItem('auth_token',response.usrToken);
                        var data = {
                          'email': $window.sessionStorage.getItem('userEmail')
                        };
                        predixUserService.getUserDetails(data).success(function (response){
                          $window.sessionStorage.setItem('customerId',response.supplierID);
                          $window.sessionStorage.setItem('roleName', response.userRole.userRoleName);
                          $window.sessionStorage.setItem('roleID', response.userRole.userRoleID);
                          $window.sessionStorage.setItem('userPermission', response.userPermission);
                          $rootScope.userRole = response.userRole.userRoleName;
                          if($rootScope.userRole == 'ge-oms'){
                            $rootScope.App.tabs = [
                                {icon: 'fa-home fa-2x', state: 'dashboards', label: 'Home'},
                                {icon: 'fa-truck fa-2x', state: 'orders', label: 'Orders'},
                                {icon: 'fa-pencil-square-o fa-2x', state: 'changeRequest', label: 'Change Request'}
                                // {icon: 'fa-gavel fa-2x', state: '', label: 'Disputes'}
                            ]
                          }else if($rootScope.userRole == 'ge-sales'){
                            $rootScope.App.tabs = [
                                {icon: 'fa-home fa-2x', state: 'dashboards', label: 'Home'},
                                {icon: 'fa-file-text-o fa-2x', state: 'quotes', label: 'Quotes'}
                            ]
                          }
                          $window.location.reload();
                        });
                    }else{
                        alert('Unable to fetch token.Please try again later.');
                    }
                });
              });
            }else {
                console.log('in else');
                // unexpected error
            }
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if (angular.isObject(error) && angular.isString(error.code)) {
                switch (error.code) {
                    case 'UNAUTHORIZED':
                        //redirect
                        predixUserService.login(toState);
                        break;
                    default:
                        //go to other error state
                }
            }
            else {
                // unexpected error
            }
        });
    }]);


    //Set on window for debugging
    window.predixApp = predixApp;

    //Return the application  object
    return predixApp;
});
