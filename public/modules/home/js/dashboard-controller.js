define(['angular', './module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('DashboardsCtrl', ['$http','$scope', '$log','DashboardService','$rootScope','PredixUserService', function ($http, $scope, $log, DashboardService, $rootScope, predixUserService) {

        DashboardService.getMyPendingActions().success(function (response) {
          console.log(response);
          $scope.pendingActions = response;
          if(response.length == 0){
              $scope.notifCount = 0;
          }else{
              $scope.notifCount = response.length;
          }

        }).error(function (response) {
          console.log(response);
        });
    }]);
});
