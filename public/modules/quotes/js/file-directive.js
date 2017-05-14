define(['angular', './module'], function(angular, module) {
    'use strict';

    /**
     * PredixUserService is a sample service which returns information about the user and if they are logged in
     */
    module.directive('fileInput', ['$parse', function($parse) {
        return {
          restrict:'A',
          link: function(scope,elm,attrs) {
            console.log('in directive');
            elm.bind('change',function(){
              $parse(attrs.fileInput)
              .assign(scope, elm[0].files)
              scope.$apply();
            })
          }
        }
    }]);
});
