angular.module("rubedoBlocks").lazy.controller('UserOrdersController',['$scope','RubedoOrdersService',function($scope,RubedoOrdersService){
    var me = this;
    var config = $scope.blockConfig;
    var options={};
    if (config.orderDetailPage){
        options.orderDetailPage=config.orderDetailPage;
    }
    RubedoOrdersService.getMyOrders(options).then(
        function(response){
            if (response.data.success){
                me.orders=response.data.orders;
                if (response.data.orderDetailPageUrl){
                    me.orderDetailPageUrl=response.data.orderDetailPageUrl;
                }
            }
        }
    );

}]);