angular.module("rubedoBlocks").lazy.controller("InsightsStatsController",["$scope",'$http', function($scope, $http){
    var me = this;
    var config=$scope.blockConfig;
    var halfrange=parseInt(config.interval/2);
    me.queryParams={
        events:config.events,
        start:moment().subtract(halfrange,"days").format("YYYY-MM-DD"),
        end:moment().add(halfrange,"days").format("YYYY-MM-DD")
    };
    var baseConfig={
        title: config.title,
        description: config.description,
        width: config.width,
        height: config.height,
        right: 40,
        target: "#block"+$scope.block.id,
        x_accessor: 'date',
        y_accessor: 'value'
    };
    me.drawGraph=function(){
        console.log(me.queryParams);
        //$http.get("/api/v1/insights/stats",{
        //    params:me.queryParams
        //}).then(function(response){
        //    if (response.data.success){
        //        delete baseConfig.xax_format;
        //        baseConfig.data = MG.convert.date(response.data.stats, 'date');
        //        MG.data_graphic(baseConfig);
        //    }
        //});
    };
}]);
