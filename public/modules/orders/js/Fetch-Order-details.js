define(['angular', './module'], function(angular, module) {
    'use strict';

    module.value('version', '0.1');

    return module.service('fetchOrderDetails',['$http',function($http){
     this.get= function(val){
           return $http.get('modules/orders/json/orderDetails.json')
        }
  }])

});
