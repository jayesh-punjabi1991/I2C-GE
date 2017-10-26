define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('DashboardsCtrl', ['$http', '$scope', '$log', 'DashboardService', '$rootScope', 'PredixUserService', '$state', function($http, $scope, $log, DashboardService, $rootScope, predixUserService, $state) {
        
        DashboardService.getMyPendingActions().success(function(response) {
            console.log(response);
            $scope.pendingActions = response;
            if (response.length == 0) {
                $scope.notifCount = 0;
            } else {
                $scope.notifCount = response.length;
            }

        }).error(function(response) {
            console.log(response);
        });

        $("#navitemlist > li:nth-child(1) > a").addClass("selected");
        $scope.processNotification = function(notif) {
            console.log('in process');
            if (notif.eventType == 'CR.Accept' || notif.eventType == 'CR.Reject' || notif.eventType == 'CR.Initiate' || notif.eventType == 'Quote.Accept' || notif.eventType == 'Order.FFInitiated') {
                $state.go('ordersDetailsA', {
                    custId: notif.cust_id,
                    id: notif.order_id
                })
            } else if (notif.eventType == 'Quote.Reject') {
                $state.go('quoteDetailsAR', {
                    custId: notif.cust_id,
                    id: notif.quote_id
                })
            } else if (notif.eventType == 'Invoice.Mismatched' || notif.eventType == 'Payment.Init') {
                $state.go('invoiceDetails', {
                    custId: notif.cust_id,
                    invNo: notif.invoice_number
                })
            } else if (notif.eventType == 'Dispute.Init') {
                $state.go('disputeDetails', {
                    custId: notif.cust_id,
                    id: notif.dispute_id
                })
            }
            // DashboardService.processNotification(notif.id).success(function (response) {
            //
            // })
        }

        $scope.markAsRead = function(notif) {
            DashboardService.processNotification(notif.id).success(function(response) {
                $state.reload();
            })
        }
    }]);
});
