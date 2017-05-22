/**
 * Constant Config
 * This is the constant definition that defines all application constants.
 */
define(['angular'], function(angular) {
    'use strict';
    return angular.module('app.constants', [])
                  .constant('urls',{
                    base_url: 'https://tcaapigateway.run.aws-usw02-pr.ice.predix.io'
                    ,fetch_token: '/fetchToken'
                    ,get_user_details: '/tcaapigateway/getUser'
                    ,get_quotes_list:'/tcaapigateway/getQuotes'
                    ,get_quote_details: '/tcaapigateway/getQuoteDetails'
                    ,get_mypending_actions: '/tcaapigateway/getGENotification'
                    ,accept_quote: '/tcaapigateway/acceptQuote'
                    ,reject_quote: '/tcaapigateway/rejectQuote'
                    ,file_upload: '/tcaapigateway/blob/upload'
                    ,get_orders_list:'/tcaapigateway/getOrders'
                    ,get_order_details:'/tcaapigateway/getOrderDetails'
                    ,get_DL_for_CR:'/tcaapigateway/getcrdl'
                    ,initiate_cr:'/tcaapigateway/initiateCR'
                    ,get_Cr_details:'/tcaapigateway/getCrDetail'
                    ,get_Cr_List:'/tcaapigateway/getAllCR'
                  });
});
