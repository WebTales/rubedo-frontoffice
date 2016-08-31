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
    me.geocoder = new google.maps.Geocoder();
    //set initial map center
    if (config.useLocation&&navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position) {
            me.map.center={
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
            };
        }, function() {
            //handle geoloc error
        });
    } else if (config.centerAddress){
        me.geocoder.geocode({
            'address' : config.centerAddress
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                me.map.center={
                    latitude:results[0].geometry.location.lat(),
                    longitude:results[0].geometry.location.lng()
                };
            }
        });

    } else if (config.centerLatitude && config.centerLongitude){
        me.map.center={
            latitude:config.centerLatitude,
            longitude:config.centerLongitude
        };
    }
    me.height = config.height ? config.height + "px" : "500px";

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
                //console.log(response.data.data.hash.buckets);
                //var pointData=[
                //    {
                //        key: "u09tv",
                //        doc_count: 41,
                //        minlat: 48.8232421875,
                //        minlon: 2.3291015625,
                //        maxlat: 48.8671875,
                //        maxlon: 2.373046875,
                //        medlat: 48.84521484375,
                //        medlon: 2.35107421875
                //    },
                //    {
                //        key: "u09vb",
                //        doc_count: 10,
                //        minlat: 48.8232421875,
                //        minlon: 2.4609375,
                //        maxlat: 48.8671875,
                //        maxlon: 2.5048828125,
                //        medlat: 48.84521484375,
                //        medlon: 2.48291015625
                //    }
                //];
                var pointData=response.data.data.hash.buckets;
                var dataPoints=[];
                angular.forEach(pointData,function(point){
                    dataPoints.push({
                        location:new google.maps.LatLng(point.medlat,point.medlon),
                        weight:point.doc_count
                    });
                });
                if(me.heatMap){
                    me.heatMap.setData(dataPoints);
                } else {
                    me.heatMap=new google.maps.visualization.HeatmapLayer({
                        data: dataPoints,
                        map: me.mapControl.getGMap()
                    });
                }
                delete (response.data.data.hash);
                me.facets=response.data.data;
                var filterCopy=angular.copy(me.filterParam);
                if (config.events&&config.events.length>0){
                    delete(filterCopy.event);
                }
                me.activeFacets=filterCopy;
                me.hasActiveFacets=Object.keys(me.activeFacets).length>0;
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
    setTimeout(function(){
        if(!me.count||me.count==0){
            google.maps.event.trigger(me.mapControl.getGMap(), 'resize');
            if (config.useLocation&&navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(position) {
                    me.mapControl.getGMap().setCenter(new google.maps.LatLng({
                        lat:position.coords.latitude,
                        lng:position.coords.longitude
                    }));


                }, function() {
                    //handle geoloc error
                });
            } else if (config.centerAddress){
                me.geocoder.geocode({
                    'address' : config.centerAddress
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        me.mapControl.getGMap().setCenter(new google.maps.LatLng({
                            lat:results[0].geometry.location.lat(),
                            lng:results[0].geometry.location.lng()
                        }));

                    }
                });

            } else if (config.centerLatitude && config.centerLongitude){
                me.mapControl.getGMap().setCenter(new google.maps.LatLng({
                    lat:config.centerLatitude,
                    lng:config.centerLongitude
                }));

            }
        }
    },3200);

}]);
