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
                var newData=[];
                angular.forEach(response.data.data,function(item){
                    newData.push({
                        label:String(item.key),
                        value:item.doc_count,
                        caption:String(item.key)+" : "+String(item.doc_count)
                    })
                });
                if(me.pie){
                    me.pie.destroy();
                }
                    me.pie = new d3pie("#block"+$scope.block.id, {
                        header: {
                            title: {
                                text: config.title
                            },
                            subtitle:{
                                text:config.description
                            }
                        },
                        size: {
                            pieInnerRadius: 0,
                            canvasHeight: config.height,
                            canvasWidth: config.width
                        },
                        data: {
                            sortOrder: "label-asc",
                            content: newData
                        },
                        tooltips: {
                            enabled: true,
                            type: "caption"
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
