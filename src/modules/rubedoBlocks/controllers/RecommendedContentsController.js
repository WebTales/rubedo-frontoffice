angular.module("rubedoBlocks").lazy.controller("RecommendedContentsController",["$scope","$location","$routeParams","$compile","RubedoSearchService","RubedoShoppingCartService","$rootScope",
    function($scope,$location,$routeParams,$compile,RubedoSearchService,RubedoShoppingCartService,$rootScope){
        var me = this;
        var config = $scope.blockConfig;
        me.contentHeight = config.summaryHeight ? config.summaryHeight : null;
        me.summaryStyle={};
        if (me.contentHeight){
            me.summaryStyle['height']=me.contentHeight+"px";
            me.summaryStyle['overflow']="hidden";
        }
        me.columns = config.columns ? config.columns : 1;
        me.colWidth=12/me.columns;
        me.colClass="col-md-"+me.colWidth;
        me.displayImage=config.displayImage;
        me.imageField= config.imageField ? config.imageField : "image";
        me.imageHeight= config.imageHeight ? config.imageHeight : null;
        me.imageWidth= config.imageWidth ? config.imageWidth : null;
        me.imageStyle={};
        if (me.imageHeight){
            me.imageStyle['height']=me.imageHeight+"px";
            me.imageStyle['overflow']="hidden";
        }
        me.imageResizeMode= config.imageResizeMode ? config.imageResizeMode : "boxed";

        me.data = [];
        me.facets = [];
        me.activeFacets = [];
        me.limit = config.pageSize ? config.pageSize:10;
        me.start = config.resultsSkip ? config.resultsSkip:0;
        var predefinedFacets = !config.predefinedFacets?{}:JSON.parse(config.predefinedFacets);
        var facetsId = ['objectType','type','damType','userType','author','userName','lastupdatetime','price','inStock','query'];
        var defaultOptions = {
            start: me.start,
            limit: me.limit,
            constrainToSite: config.constrainToSite,
            predefinedFacets: config.predefinedFacets,
            displayMode: config.displayMode,
            displayedFacets: '["all"]',
            pageId: $scope.rubedo.current.page.id,
            siteId: $scope.rubedo.current.site.id
            //fingerprint:USER.RUID(),
            //isMagic:true,
            //historyDepth: config.historyDepth ? config.historyDepth : 30,
            //historySize : config.historySize  ? config.historySize  : 50
        };
        if (config.singlePage){
            defaultOptions.detailPageId = config.singlePage;
        }
        var options = angular.copy(defaultOptions);



        me.changePageAction = function(){
            options.start = me.start;
            me.searchByQuery(options);
        };

        me.changeLimit = function(limit){
            if(me.limit != limit){
                me.limit = limit;
                me.start = 0;
                $location.search('limit',me.limit);
            }
        };
        me.target = function(data){
            var res = '';
            if (data.objectType == 'dam'){
                res = '_blank';
            }
            return res;
        };

        me.searchByQuery = function(options){
            RubedoSearchService.searchContents(options).then(function(response){
                if(response.data.success){
                    me.query = response.data.results.query;
                    me.count = response.data.count;
                    me.data =  response.data.results.data;
                    me.facets = response.data.results.facets;
                    me.notRemovableTerms = [];
                    me.activeTerms = [];
                    $scope.clearORPlaceholderHeight();
                }
            });
        };
        me.searchByQuery(options);
    }]);