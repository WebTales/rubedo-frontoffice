angular.module("rubedoBlocks").lazy.controller("InsightsRepartitionController",["$scope",'RubedoClickStreamService', function($scope, RubedoClickStreamService){
    var me = this;
    var config=$scope.blockConfig;
    me.queryParams={
        facet:config.facet,
        event:config.event,
        startDate:moment().subtract(config.interval,"days").format("YYYY-MM-DD"),
        endDate:moment().format("YYYY-MM-DD")
    };
    me.drawGraph=function(){
        RubedoClickStreamService.getEventFacet(me.queryParams).then(function(response){
            if (response.data.success){
                console.log(response.data.data);
                var newData=[];
                angular.forEach(response.data.data,function(item){
                    newData.push({
                        label:String(item.key),
                        value:item.doc_count
                    })
                });
                var pie = new d3pie("#block"+$scope.block.id, {
                    header: {
                        title: {
                            text: config.title
                        },
                        location: "pie-center"
                    },
                    size: {
                        pieInnerRadius: "40%"
                    },
                    data: {
                        sortOrder: "label-asc",
                        content: newData
                    }
                });
            }
        });
    };
    $script('/components/mbostock/d3/d3.min.js', function () {
        $script('/components/benkeen/d3pie/d3pie/d3pie.min.js', function () {
            me.drawGraph();
        });
    });

}]);
