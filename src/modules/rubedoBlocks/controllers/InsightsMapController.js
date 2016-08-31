angular.module("rubedoBlocks").lazy.controller("InsightsMapController",["$scope",'RubedoClickStreamService', function($scope, RubedoClickStreamService){
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
        startDate:moment().subtract(config.interval,"days").format("YYYY-MM-DD"),
        endDate:moment().format("YYYY-MM-DD")
    };
    me.drawGraph=function(){
        me.queryParams.filters=JSON.stringify(me.filterParam);
        RubedoClickStreamService.getGeoAgg(me.queryParams).then(function(response){
            if (response.data.success){
                console.log(response.data.data);
                //delete (response.data.data.events);
                //me.facets=response.data.data;
                //var filterCopy=angular.copy(me.filterParam);
                //if (config.events&&config.events.length>0){
                //    delete(filterCopy.event);
                //}
                //me.activeFacets=filterCopy;
                //me.hasActiveFacets=Object.keys(me.activeFacets).length>0;
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

    me.drawGraph();

}]);
