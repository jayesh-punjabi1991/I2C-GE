define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('CRCtrl', ['$scope', '$log', '$timeout', 'CrService', '$http', 'PredixUserService', '$window', '$filter', function($scope, $log, $timeout, CrService, $http, PredixUserService, $window, $filter) {
        $scope.ChangeRequestList = [];
        $scope.ChangeRequestListPending = [];
        $scope.ChangeRequestListNotPending = [];
        $scope.Loading=true;
        $scope.DescriptionforSysRaisedCR="TradeConnect generated Change Request – Initiated due to amendment in materially significant fields";

        if ($window.sessionStorage.getItem('auth_token')) {
            CrService.getCrList().then(function success(response) {
                console.log(response);
                $scope.GetCR(response);
                $scope.Loading=false;
            })
        }
        window.sortbydate= function(a, b) {
          if(this.descending) {
            if(new Date(a.value) < new Date(b.value)) {
              return 1;
            }
            return -1;
          }
          else {
            if(new Date(a.value) > new Date(b.value)) {
              return 1;
            }
            return -1;
          }
        }

        window.sortbyCRNumber= function(a, b) {
            if(this.descending) {
              if(parseInt(a.value.substr(a.value.indexOf('>')+1,a.value.indexOf('</a>')-a.value.indexOf('>')+1)) < parseInt(b.value.substr(b.value.indexOf('>')+1,b.value.indexOf('</a>')-b.value.indexOf('>')+1))){
                return 1;
              }
              return -1;
            }
            else {
              if(parseInt(a.value.substr(a.value.indexOf('>')+1,a.value.indexOf('</a>')-a.value.indexOf('>')+1)) > parseInt(b.value.substr(b.value.indexOf('>')+1,b.value.indexOf('</a>')-b.value.indexOf('>')+1))) {
                return 1;
              }
              return -1;
            }
          }
        $scope.GetCR=function(valuedata){
          $scope.ChangeRequestList=[];
          angular.forEach(valuedata.data, function(val, ind) {
              angular.forEach(val.crs, function(value, key) {
                  $scope.ChangeRequestList.push({
                      "order#": value.ge_order_number,
                      "cr#": value.status == 'Accepted' ? "<a href='/changeRequest/Accepted/" + val.custId + "/" + value.change_req_id + "'>" + value.change_req_id + "</a>" : value.status == 'Rejected' ? "<a href='/changeRequest/Rejected/" + val.custId + "/" + value.change_req_id + "'>" + value.change_req_id + "</a>" : "<a href='/changeRequest/Pending/" + val.custId + "/" + value.change_req_id + "'>" + value.change_req_id + "</a>",
                      "PO#": value.cust_po_number,
                      "createdDate": value.cr_date ? $filter('date')(value.cr_date * 1000, "MMM dd, yyyy") : '',
                      "status": value.status === "accepted" ? "<div class='status_accept'></div>" + value.status  : value.status === "rejected" ? "<div class='status_reject'></div>" + value.status: "<div class='status_pending'></div>" + value.status,
                      "action": value.order_process_status == 'Pending' ? "<a title='Withdraw a change Request' style='color:#9c9c20 !important' href='javascript:void(0)'><i class='fa fa-undo' aria-hidden='true'></i></a>" : "",
                      "crDesc": value.from=='system' ? $scope.DescriptionforSysRaisedCR.substring(0,20) + '...' :value.description.substring(0, 20) + '...',
                      "custId":val.custId,
                      "cr_date":value.cr_date,
                      "actualstatus":value.status
                  });
              })
          })
          $scope.SortData();
        }

        //Successive Sorting on Load
        $scope.SortData=function(){
          //Active CR's sorted by date
          angular.forEach($scope.ChangeRequestList,function(v,k){
            if(v.actualstatus=="pending"){
              $scope.ChangeRequestListPending.push(v);
            }
          })
          $scope.ChangeRequestListPending=$filter("orderBy")($scope.ChangeRequestListPending,"cr_date");

          //Non Active CR's sorted by date
          angular.forEach($scope.ChangeRequestList,function(v,k){
            if(v.actualstatus!="pending"){
              $scope.ChangeRequestListNotPending.push(v);
            }
          })
          $scope.ChangeRequestListNotPending=$filter("orderBy")($scope.ChangeRequestListNotPending,"cr_date");

          //Pushing Active and Non Active CR's in sorted order together
          $scope.ChangeRequestList=[];
          angular.forEach($scope.ChangeRequestListPending,function(value,key){
            $scope.ChangeRequestList.push(value);
          })
          angular.forEach($scope.ChangeRequestListNotPending,function(value,key){
            $scope.ChangeRequestList.push(value);
          })
          $scope.Length = $scope.ChangeRequestList.length;
        }

        $timeout(function(){
        document.getElementById('Cancel').addEventListener("click",ResetData);
        function ResetData(){
          $scope.Loading=true;
          CrService.getCrList().then(function success(response) {
              console.log(response.data);
              $scope.Loading=false;
              $scope.GetCR(response);
          });
        }

        document.getElementById('rangePicker').addEventListener('px-datetime-range-submitted', function(e) {
            $scope.Loading=true;
            var fromDate1 = e.detail.range.from.split('T')[0];
            var toDate1 = e.detail.range.to.split('T')[0];
            function ConvertDate(val) {
                var d = new Date(val);
                var n = d.getFullYear();
                var n1 = d.getMonth();
                n1=parseInt(n1);
                n1=n1+1;
                n1=n1.toString();
                if(n1 <= 9)
                n1 = '0'+n1;
                var n2 = d.getDate();
                if(n2 <= 9)
                n2 = '0'+n2;
                return n2+"-"+n1+"-"+n;
            }
            var fromDate=ConvertDate(fromDate1);
            var toDate=ConvertDate(toDate1);
            $window.sessionStorage.setItem('fromDate',fromDate);
            $window.sessionStorage.setItem('toDate',toDate);
            CrService.getCrListByDate().then(function success(response) {
                console.log(response.data);
                $scope.Loading=false;
                $scope.GetCR(response);
            });
        });
      },2000);

    }]);
});
