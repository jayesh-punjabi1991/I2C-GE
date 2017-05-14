define(['angular', './module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('UserCtrl', ['$http','$scope','$rootScope','PredixUserService','$state','$window', function ($http, $scope, $rootScope, predixUserService, $state, $window) {
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
                  console.log(response);
                  $window.sessionStorage.setItem('customerId',response.supplierID);
                  $window.sessionStorage.setItem('roleName', response.userRole.userRoleName);
                  $window.sessionStorage.setItem('roleID', response.userRole.userRoleID);
                  $window.sessionStorage.setItem('userPermission', response.userPermission);
                  console.log($window.sessionStorage.getItem('userRole'));
                  $state.go('dashboards');
                });
            }else{
                alert('Unable to fetch token.Please try again later.');
            }
        });
      });
    }]);
});
