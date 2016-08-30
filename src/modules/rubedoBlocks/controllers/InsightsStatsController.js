angular.module("rubedoBlocks").lazy.controller("InsightsStatsController",["$scope",'$http', function($scope, $http){
    var me = this;
    var config=$scope.blockConfig;
    me.activeFacets={};
    me.hasActiveFacets=false;
    me.facets={

    };
    me.filterParam={
    };
    if (config.events&&config.events.length>0){
        me.filterParam.event=config.events;
    }
    me.queryParams={
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
        me.queryParams.filters=JSON.stringify(me.filterParam);
        $http.get("/api/v1/clickstream/histogram",{
            params:me.queryParams
        }).then(function(response){
            if (response.data.success){
                delete baseConfig.xax_format;
                baseConfig.legend=[];
                baseConfig.data=[];
                angular.forEach(response.data.data.events.buckets, function(event) {
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
                delete (response.data.data.events);
                me.facets=response.data.data;
                var filterCopy=angular.copy(me.filterParam);
                if (config.events&&config.events.length>0){
                    delete(filterCopy.event);
                }
                me.activeFacets=filterCopy;
                me.hasActiveFacets=Object.keys(me.activeFacets).length>0;
                MG.data_graphic(baseConfig);
            }
        });
    };
    me.applyFilter=function(key,value){
        me.filterParam[key]=value;
        me.drawGraph();
    };
    me.clearFacet=function(key){
        delete(me.filterParam[key]);
        me.drawGraph();
    };
    $script('/components/mbostock/d3/d3.min.js', function () {
        $script('/components/mozilla/metrics-graphics/dist/metricsgraphics.min.js', function () {
            me.drawGraph();
        });
    });

}]);
