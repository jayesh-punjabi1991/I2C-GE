/**
 * Router Config
 * This is the router definition that defines all application routes.
 */
define(['angular', 'angular-ui-router'], function(angular) {
    'use strict';
    return angular.module('app.routes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {


        //Turn on or off HTML5 mode which uses the # hash
        $locationProvider.html5Mode(true).hashPrefix('!');

        /**
         * Router paths
         * This is where the name of the route is matched to the controller and view template.
         */
        $stateProvider
         .state('secure', {
                template: '<ui-view/>',
                abstract: true,
                resolve: {
                    authenticated: ['$q', 'PredixUserService', function ($q, predixUserService) {
                        var deferred = $q.defer();
                        predixUserService.isAuthenticated().then(function(userInfo){
                            deferred.resolve(userInfo);
                        }, function(){
                            deferred.reject({code: 'UNAUTHORIZED'});
                        });
                        return deferred.promise;
                    }]
                }
            })
            .state('home', {
                parent: 'secure',
                url: '/home',
                templateUrl: 'modules/home/views/home.html',
                controller: 'UserCtrl'
            })
            .state('dashboards', {
                parent: 'secure',
                url: '/dashboards',
                templateUrl: 'modules/home/views/dashboards.html',
                controller: 'DashboardsCtrl'
            })
            .state('orders', {
                parent: 'secure',
                url: '/orders',
                templateUrl: 'modules/orders/views/orders.html',
                controller: 'OrderCtrl'
            })
            .state('ordersDetailsA', {
                url: '/orderDetails/Accepted/:custId/:id',
                templateUrl: 'modules/orders/views/order-details-Accepted.html',
                controller: 'OrderDetailsCtrl'
            })
            .state('ordersDetailsR', {
                parent: 'secure',
                url: '/orderDetails/Rejected/:custId/:id',
                templateUrl: 'modules/orders/views/order-details-Rejected.html',
                controller: 'OrderDetailsCtrl'
            })
            .state('ordersDetailsCR', {
                parent: 'secure',
                url: '/orderDetails/CR/:custId/:id',
                templateUrl: 'modules/orders/views/order-details-CR.html',
                controller: 'OrderDetailsCtrl'
            })
            .state('changeRequest', {
                parent: 'secure',
                url: '/changeRequest',
                templateUrl: 'modules/changeRequest/views/changeRequest.html',
                controller: 'CRCtrl'
            })
            .state('changeRequestDetailsA', {
                parent: 'secure',
                url: '/changeRequest/Accepted/:custId/:id',
                templateUrl: 'modules/changeRequest/views/CRdetailsAccepted.html',
                controller: 'CRDetailsCtrl'
            })
            .state('changeRequestDetailsR', {
                parent: 'secure',
                url: '/changeRequest/Rejected/:custId/:id',
                templateUrl: 'modules/changeRequest/views/CRdetailsRejected.html',
                controller: 'CRDetailsCtrl'
            })
            .state('changeRequestDetailsP', {
                parent: 'secure',
                url: '/changeRequest/Pending/:custId/:id',
                templateUrl: 'modules/changeRequest/views/CRdetailsPending.html',
                controller: 'CRDetailsCtrl'
            });


        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            //document.querySelector('px-app-nav').markSelected('/dashboards');
            $state.go('home');
        });

    }]);
});
