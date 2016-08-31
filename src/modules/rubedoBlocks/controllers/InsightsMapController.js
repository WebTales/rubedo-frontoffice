angular.module("rubedoBlocks").lazy.controller("InsightsMapController",["$scope",'RubedoClickStreamService','$element', function($scope, RubedoClickStreamService,$element){
    var me = this;
    var config=$scope.blockConfig;
    me.activeFacets={};
    me.hasActiveFacets=false;
    me.facets={

    };
    me.filterParam={
    };
    me.map={
        center:{
            latitude:48.8567,
            longitude:2.3508
        },
        zoom:config.zoom ? config.zoom : 14
    };
    me.height = config.height ? config.height + "px" : "500px";
    me.geocoder = new google.maps.Geocoder();
    if (config.events&&config.events.length>0){
        me.filterParam.event=config.events;
    }
    me.queryParams={
        startDate:moment().subtract(config.interval,"days").format("YYYY-MM-DD"),
        endDate:moment().format("YYYY-MM-DD")
    };
    me.mapControl={ };
    //map events
    me.mapTimer = null;
    me.mapEvents = {
        "bounds_changed": function (map) {
            clearTimeout(me.mapTimer);
            me.mapTimer = setTimeout(function() {
                me.drawGraph();
            }, 300);
        }
    };
    me.drawGraph=function(){
        var params=angular.copy(me.filterParam);
        var bounds=me.mapControl.getGMap().getBounds();
        params.inflat=bounds.getSouthWest().lat();
        params.suplat=bounds.getNorthEast().lat();
        params.inflon=bounds.getSouthWest().lng();
        params.suplon=bounds.getNorthEast().lng();
        me.queryParams.filters=JSON.stringify(params);
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
    me.display = function () {

        return true;
    };
    if (config.height&&config.height!=500){
        setTimeout(function(){
            $element.find(".angular-google-map-container").height(config.height);
        },190);
    }

}]);
