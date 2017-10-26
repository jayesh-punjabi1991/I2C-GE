define(['angular', './module'], function(angular, module) {
    'use strict';

    /**
     * PredixUserService is a sample service which returns information about the user and if they are logged in
     */
     module.directive('accordion', function ($timeout) {
         return {
             restrict: "C",
             scope: { ngModel: '=' },
             link: function (scope, elm, attr) {
                console.log('in accordion directive');
                console.log(elm);
                 $timeout(function () {
                     $(elm).accordion();
                 }, 0);
             }
         };
     });
});
