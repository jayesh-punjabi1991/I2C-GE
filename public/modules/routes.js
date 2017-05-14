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
            .state('quotes', {
                parent: 'secure',
                url: '/quotes',
                templateUrl: 'modules/quotes/views/quotes.html',
                controller: 'QuotesCtrl'
            })
            .state('quoteDetails', {
                parent: 'secure',
                url: '/quoteDetails/:id',
                templateUrl: 'modules/quotes/views/quote-details.html',
                controller: 'QuoteDetailsCtrl'
            })
            .state('quoteDetailsAR', {
                parent: 'secure',
                url: '/quoteDetails/AR/:id',
                templateUrl: 'modules/quotes/views/quote-details-ar.html',
                controller: 'QuoteDetailsCtrl'
            })
            .state('orders', {
                parent: 'secure',
                url: '/orders',
                templateUrl: 'modules/orders/views/orders.html',
                controller: 'OrderCtrl'
            })
            .state('ordersDetails', {
                parent: 'secure',
                url: '/orderDetails/:id',
                templateUrl: 'modules/orders/views/order-details-Generated.html',
                controller: 'OrderDetailsCtrl'
            });


        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            document.querySelector('px-app-nav').markSelected('/dashboards');
            $state.go('home');
        });

    }]);
});
