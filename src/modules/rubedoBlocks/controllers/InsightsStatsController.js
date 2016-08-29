angular.module("rubedoBlocks").lazy.controller("InsightsStatsController",["$scope",'$http', function($scope, $http){
    var me = this;
    var config=$scope.blockConfig;
    me.queryParams={
        "events[]":config.events,
        granularity:config.granularity,
        startDate:moment().subtract(config.interval,"days").format("YYYY-MM-DD"),
        endDate:moment().format("YYYY-MM-DD")
    };
    var baseConfig={
        title: config.title,
        description: config.description,
        width: config.width,
        height: config.height,
        right: 40,
        target: "#block"+$scope.block.id,
        x_accessor: 'date',
        y_accessor: 'value',
        aggregate_rollover: true
    };
    me.drawGraph=function(){
        $http.get("/api/v1/clickstream/histogram",{
            params:me.queryParams
        }).then(function(response){
            if (response.data.success){
                delete baseConfig.xax_format;
                baseConfig.legend=[];
                baseConfig.data=[];
                angular.forEach(response.data.data, function(event) {
                    baseConfig.legend.push(event.key);
                    var occurences=[];
                    angular.forEach(event.dateHistogram.buckets,function(bucket){
                        occurences.push({
                            value:bucket["doc_count"],
                            date:new Date(bucket["key_as_string"])
                        });
                    });
                    baseConfig.data.push(occurences);
                });
                MG.data_graphic(baseConfig);
            }
        });

    };
    me.drawGraph();
}]);
