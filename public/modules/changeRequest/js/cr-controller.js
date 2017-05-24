define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('CRCtrl', ['$scope', '$log', '$timeout', 'CrService', '$http', 'PredixUserService', '$window', '$filter', function($scope, $log, $timeout, CrService, $http, PredixUserService, $window, $filter) {
        $scope.ChangeRequestList = [];
        /*CrService.getCrList().then(function success(response){
          angular.forEach(response.data,function(value,key){
            $scope.ChangeRequestList.push({"order#":value.ge_order_number,"cr#":value.status== 'Accepted' ? "<a href='/changeRequest/Accepted/"+value.change_req_id+ "'>"+value.change_req_id+"</a>" :value.status== 'Rejected' ? "<a href='/changeRequest/Rejected/"+value.change_req_id+ "'>"+value.change_req_id+"</a>" : "<a href='/changeRequest/Pending/"+value.change_req_id+"'>"+value.change_req_id+"</a>","PO#":value.cust_po_number,"createdDate":value.order_date,"value":value.contract_amount,"status":value.status,"action":value.order_process_status=='Pending' ? "<a title='Withdraw a change Request' style='color:#9c9c20 !important' href='javascript:void(0)'><i class='fa fa-undo' aria-hidden='true'></i></a>" : ""});
          })
        })*/

        if ($window.sessionStorage.getItem('auth_token')) {
            CrService.getCrList().then(function success(response) {
                console.log(response);
                angular.forEach(response.data, function(val, ind) {
                    angular.forEach(val.crs, function(value, key) {
                        $scope.ChangeRequestList.push({
                            "order#": value.ge_order_number,
                            "cr#": value.status == 'Accepted' ? "<a href='/changeRequest/Accepted/" + val.custId + "/" + value.change_req_id + "'>" + value.change_req_id + "</a>" : value.status == 'Rejected' ? "<a href='/changeRequest/Rejected/" + val.custId + "/" + value.change_req_id + "'>" + value.change_req_id + "</a>" : "<a href='/changeRequest/Pending/" + val.custId + "/" + value.change_req_id + "'>" + value.change_req_id + "</a>",
                            "PO#": value.cust_po_number,
                            "createdDate": value.cr_date ? $filter('date')(value.cr_date * 1000, "MMM dd, yyyy") : '',
                            "status": value.status === "accepted" ? "<div id='circle'></div><p>" + value.status +"</p>" : value.status === "rejected" ? "<div id='circle1'></div><p>" + value.status + "</p>": "<div id='circle2'></div><p>" + value.status + "</p>",
                            "action": value.order_process_status == 'Pending' ? "<a title='Withdraw a change Request' style='color:#9c9c20 !important' href='javascript:void(0)'><i class='fa fa-undo' aria-hidden='true'></i></a>" : "",
                            "crDesc": value.description
                        });
                    })
                })
                $scope.Length = $scope.ChangeRequestList.length;
            })
        }
    }]);
});
