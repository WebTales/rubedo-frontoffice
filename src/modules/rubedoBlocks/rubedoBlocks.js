/**
 * Module that manages blocks
 */
(function(){
    var module = angular.module('rubedoBlocks',['rubedoDataAccess', 'lrInfiniteScroll','rubedoFields','snap']);

    var blocksConfig = {
        image:"/components/webtales/rubedo-frontoffice/templates/blocks/image.html",
        blockNotFound:"/components/webtales/rubedo-frontoffice/templates/blocks/blockNotFound.html",
        navigation:"/components/webtales/rubedo-frontoffice/templates/blocks/navigation.html",
        contentList:"/components/webtales/rubedo-frontoffice/templates/blocks/contentList.html",
        authentication:"/components/webtales/rubedo-frontoffice/templates/blocks/authentication.html",
        simpleText:"/components/webtales/rubedo-frontoffice/templates/blocks/simpleText.html",
        richText:"/components/webtales/rubedo-frontoffice/templates/blocks/richText.html",
        contentDetail:"/components/webtales/rubedo-frontoffice/templates/blocks/contentDetail.html",
        calendar:"/components/webtales/rubedo-frontoffice/templates/blocks/calendar.html",
        development:"/components/webtales/rubedo-frontoffice/templates/blocks/development.html",
        customTemplate:"/components/webtales/rubedo-frontoffice/templates/blocks/customTemplate.html",
        carrousel:"/components/webtales/rubedo-frontoffice/templates/blocks/carousel.html",
        imageGallery:"/components/webtales/rubedo-frontoffice/templates/blocks/gallery.html",
        damList:"/components/webtales/rubedo-frontoffice/templates/blocks/mediaList.html",
        searchResults:"/components/webtales/rubedo-frontoffice/templates/blocks/searchResults.html"
    };

    module.factory('RubedoBlockTemplateResolver', function() {
        var serviceInstance={};
        serviceInstance.getTemplate=function(bType,bConfig){
            if (!angular.element.isEmptyObject(bConfig.customTemplate)){
                return (blocksConfig.customTemplate);
            } else if (blocksConfig[bType]){
                return (blocksConfig[bType]);
            } else {
                return (blocksConfig.blockNotFound);
            }
        };
        return serviceInstance;
    });

    //generic block directive
    module.directive("rubedoBlock",function(){
        return {
            restrict:"E",
            templateUrl:"/components/webtales/rubedo-frontoffice/templates/rubedoBlock.html"
        };
    });

    //custom template directive
    module.directive( 'rubedoCustomTemplate',['$compile', function ( $compile ) {
        return {
            scope: true,
            restrict:"E",
            link: function ( scope, element, attrs ) {
                var el;
                attrs.$observe( 'template', function ( tpl ) {
                    if ( angular.isDefined( tpl ) ) {
                        el = $compile( tpl )( scope );
                        element.html("");
                        element.append( el );
                    }
                });
            }
        };
    }]);

    //block controllers start here
    module.controller("MenuController",['$scope','$location','RubedoMenuService',function($scope,$location,RubedoMenuService){
        var me=this;
        me.menu={};
        me.currentRouteleine=$location.path();
        var config=$scope.blockConfig;
        var pageId=$scope.rubedo.current.page.id;
        if (config.rootPage){
            pageId=config.rootPage;
        }
        RubedoMenuService.getMenu(pageId, config.menuLevel).then(function(response){
            if (response.data.success){
                me.menu=response.data.menu;
            } else {
                me.menu={};
            }
        });
    }]);

    module.controller("ContentListController",['$scope','$compile','RubedoContentsService',function($scope,$compile,RubedoContentsService){
        var me = this;
        me.contentList=[];
        var config=$scope.blockConfig;
        var pageId=$scope.rubedo.current.page.id;
        var siteId=$scope.rubedo.current.site.id;
        me.contentHeight = config.summaryHeight?config.summaryHeight:80;
        me.start = config.resultsSkip?config.resultsSkip:0;
        me.limit = config.pageSize?config.pageSize:12;
        var options = {
            start: me.start,
            limit: me.limit
        };
        if(config.singlePage){
            options.detailPageId = config.singlePage;
        }
        me.showPaginator = config.showPager && !config.infiniteScroll;
        me.changePageAction = function(){
            options.start = me.start;
            me.getContents(config.query, pageId, siteId, options);
        };
        if (config.infiniteScroll){
            me.limit = options['limit'];
            me.blockStyle = {
                height: (me.limit * me.contentHeight - me.contentHeight)+'px',
                'overflow-y': 'scroll'
            };
            me.timeThreshold = config['timeThreshold'] ? config['timeThreshold']:200;
            me.scrollThreshold = config['scrollThreshold'] ? config['scrollThreshold']:300;
        } else {
            me.blockStyle = {
                'overflow-y': 'visible'
            };
        }
        me.getContents = function (queryId, pageId, siteId, options, add, reloadPager){
            RubedoContentsService.getContents(queryId,pageId,siteId, options).then(function(response){
                if (response.data.success){
                    me.count = response.data.count;
                    if (add){
                        response.data.contents.forEach(function(newContent){
                            me.contentList.push(newContent);
                        });
                    } else {
                        me.contentList=response.data.contents;
                    }
                    if (me.showPaginator && reloadPager){
                        $compile(angular.element('paginator'))($scope);
                    }
                }
            });
        };
        $scope.loadMoreContents = function(){
            if (options['start'] + options['limit'] < me.count){
                options['start'] += options['limit'];
                me.getContents(config.query, pageId, siteId, options, true);
            }
        };
        me.getContents(config.query, pageId, siteId, options, false, true);
    }]);

    module.directive("paginator",["$timeout",function($timeout){
        return {
            restrict: 'E',
            templateUrl: "/components/webtales/rubedo-frontoffice/templates/paginator.html",
            scope:{
                start: '=start',
                limit: '=limit',
                count: '=count',
                changePageAction: '&changePageAction'
            },
            controller: function($scope, $timeout){
                var me = this;
                me.actualPage = 1;
                me.nbPages = Math.ceil(($scope.count - $scope.start)/$scope.limit);
                me.showPager = me.nbPages > 1;
                var resultsSkip = $scope.start;
                me.showActive = function(value){
                    return value == me.actualPage;
                };
                me.getPagesNumber = function (index){
                    var res;
                    if (me.actualPage < 6 || (me.nbPages <= 9? me.nbPages : 9) < 9){
                        res = index+1;
                    } else if (me.actualPage + 4 >= me.nbPages) {
                        res = me.nbPages - (8 - index);
                    } else {
                        res = me.actualPage + (index - 4);
                    }
                    return res;
                };
                me.getIteration = function(num){
                    return new Array(num <= 9? num : 9);
                };
                me.changePage = function(value){
                    if (me.actualPage != value + 1){
                        if (value == 'prev'){
                            me.actualPage -= 1;
                            value = me.actualPage -1;
                        } else if (value == 'next'){
                            me.actualPage += 1;
                            value = me.actualPage -1;
                        } else {
                            me.actualPage = value + 1;
                        }
                        $scope.start = (value * $scope.limit);
                        if (resultsSkip)
                            $scope.start += resultsSkip;
                        $timeout($scope.changePageAction);
                    }
                };
            },
            controllerAs: 'paginatorCtrl'
        }
    }]);

    module.controller("CarouselController",["$scope","RubedoContentsService",function($scope,RubedoContentsService){
        var me=this;
        me.contents=[];
        var blockConfig=$scope.blockConfig;
        var queryOptions={
            start: !angular.element.isEmptyObject(blockConfig.resultsSkip) ? blockConfig.resultsSkip : 0,
            limit: !angular.element.isEmptyObject(blockConfig.pageSize) ? blockConfig.pageSize : 6
        };
        var pageId=$scope.rubedo.current.page.id;
        var siteId=$scope.rubedo.current.site.id;
        me.getContents=function(){
            RubedoContentsService.getContents(blockConfig.query,pageId,siteId, queryOptions).then(
                function(response){
                    if (response.data.success){
                        me.contents=response.data.contents;
                        setTimeout(function(){me.initCarousel();},10);
                    }
                }
            );
        };
        me.initCarousel=function(){
            var targetElSelector="#block"+$scope.block.id;
            var owlOptions={
                responsiveBaseWidth:targetElSelector,
                singleItem:true,
                pagination: blockConfig.showPager,
                navigation: blockConfig.showNavigation,
                autoPlay: blockConfig.autoPlay,
                stopOnHover: blockConfig.stopOnHover,
                paginationNumbers:blockConfig.showPagingNumbers,
                navigationText: ['<span class="glyphicon glyphicon-chevron-left"></span>','<span class="glyphicon glyphicon-chevron-right"></span>'],
                lazyLoad:true
            };
            angular.element(targetElSelector).owlCarousel(owlOptions);
        };
        me.getImageOptions=function(){
            return({
                width:angular.element("#block"+$scope.block.id).width(),
                height:blockConfig.imageHeight,
                mode:blockConfig.imageResizeMode
            });
        };
        if (blockConfig.query){
            me.getContents();
        }
    }]);


    module.controller("AuthenticationController",["$scope","RubedoAuthService","snapRemote",function($scope,RubedoAuthService,snapRemote){
        var me=this;
        me.blockConfig=$scope.blockConfig;
        me.credentials={ };
        me.authError=null;
        me.authenticate=function(){
            me.authError=null;
            if ((!me.credentials.login)||(!me.credentials.password)){
                me.authError="Please fill in all required fields."
            } else {
                RubedoAuthService.generateToken(me.credentials).then(
                    function(response){
                        angular.element("#rubedoAuthModal").modal('hide');
                        $scope.rubedo.current.user=response.data.token.user;
                        if (response.data.token.user.rights.canEdit){
//                            snapRemote.getSnapper().then(function(snapper) {
//                                snapper.enable();
//                            });
                        }
                    },
                    function(response){
                        me.authError=response.data.message;
                    }
                );
            }
        };
        me.logOut=function(){
            RubedoAuthService.clearPersistedTokens();
            $scope.rubedo.current.user=null;
            $scope.rubedo.fieldEditMode=false;
            snapRemote.close();
//            snapRemote.getSnapper().then(function(snapper) {
//                snapper.disable();
//            });
        }
    }]);

    module.controller("SimpleTextController",["$scope","RubedoContentsService",function($scope, RubedoContentsService){
        var me = this;
        var config = $scope.blockConfig;
        me.getContentById = function (contentId){
            RubedoContentsService.getContentById(contentId).then(
                function(response){
                    if(response.data.success){
                        me.body = response.data.content.fields.body;
                    }
                }
            )
        };
        me.getContentById(config.contentId);
    }]);

    module.controller("RichTextController",["$scope","$sce","RubedoContentsService",function($scope, $sce,RubedoContentsService){
        var me = this;
        var config = $scope.blockConfig;
        me.getContentById = function (contentId){
            RubedoContentsService.getContentById(contentId).then(
                function(response){
                    if(response.data.success){
                        me.body=$sce.trustAsHtml(jQuery.htmlClean(response.data.content.fields.body, {
                            allowedAttributes:[["style"]],
                            format: true
                        }));
                    }
                }
            )
        };
        me.getContentById(config.contentId);
    }]);

    module.controller("ContentDetailController",["$scope","RubedoContentsService",function($scope, RubedoContentsService){
        var me = this;
        var config = $scope.blockConfig;
        $scope.$watch('rubedo.fieldEditMode', function(newValue) {
            $scope.fieldEditMode=me.content&&me.content.readOnly ? false : newValue;

        });
        me.getContentById = function (contentId){
            RubedoContentsService.getContentById(contentId).then(
                function(response){
                    if(response.data.success){
                        me.content=response.data.content;
                        $scope.fieldEntity=angular.copy(me.content.fields);
                        $scope.fieldLanguage=me.content.locale;
                        //use only default template for now
                        me.content.type.fields.unshift({
                            cType:"title",
                            config:{
                                name:"text",
                                fieldLabel:"Title",
                                allowBlank:false
                            }
                        });
                        me.detailTemplate='/components/webtales/rubedo-frontoffice/templates/blocks/contentDetail/default.html';
                    }
                }
            );
        };
        if (config.contentId){
            me.getContentById(config.contentId);
        }
        me.revertChanges=function(){
            $scope.fieldEntity=angular.copy(me.content.fields);
        };
        me.registerEditChanges=function(){
            $scope.rubedo.registerEditCtrl(me);
        };
        me.persistChanges=function(){
            var payload=angular.copy(me.content);
            payload.fields=angular.copy($scope.fieldEntity);
            delete (payload.type);
            RubedoContentsService.updateContent(payload).then(
                function(response){console.log(response);},
                function(response){console.log(response);}
            );
        }

        $scope.registerFieldEditChanges=me.registerEditChanges;
    }]);

    module.controller("CalendarController",["$scope","$route","RubedoContentsService",function($scope,$route,RubedoContentsService){
        var me = this;

        var config = $scope.blockConfig;
        var pageId=$scope.rubedo.current.page.id;
        var siteId=$scope.rubedo.current.site.id;
        me.contents = [];
        me.calendarId = 'block-'+$scope.block.id+'-calendar';
        var options = {
            dateFieldName: config['date'],
            endDateFieldName: config['endDate'],
            limit: 1000,
            'fields[]':['text',config['date'],config['endDate'],'summary','image']
        };
        me.getContents = function (queryId, pageId, siteId, options, cb){
            RubedoContentsService.getContents(queryId,pageId,siteId, options).then(function(response){
                if (response.data.success){
                    cb(response.data);
                }
            })
        };
        me.init = function(){
            me.calendar = angular.element('#'+me.calendarId);
            me.calendar.fullCalendar({
                lang: $route.current.params.lang,
                weekMode: 'liquid',
                timezone: false,
                viewRender: function(view){
                    options.date = moment(view.start.format()).unix();
                    options.endDate = moment(view.end.format()).unix();
                    me.getContents(config.query, pageId, siteId, options, function(data){
                        me.contents = data.contents;
                        var newEvents = [];
                        me.contents.forEach(function(content){
                            var event = {};
                            event.title = content.fields.text;
                            event.start = moment.unix(content.fields[config['date']]).format('YYYY-MM-DD');
                            event.end = moment.unix(content.fields[config['endDate']]).format('YYYY-MM-DD');
                            newEvents.push(event);
                        });
                        me.calendar.fullCalendar('removeEvents');
                        me.calendar.fullCalendar('addEventSource', newEvents);
                        me.calendar.fullCalendar('refetchEvents');
                    });
                }
            });
        };
    }]);

    module.controller("MediaListController",["$scope","$compile","RubedoSearchService",function($scope,$compile,RubedoSearchService){
        var me = this;
        var config = $scope.blockConfig;
        me.media = [];
        me.start = 0;
        me.limit = config.pagesize?config.pagesize:12;
        var options = {
            start: me.start,
            limit: me.limit,
            constrainToSite: config.constrainToSite,
            siteId: $scope.rubedo.current.site.id,
            predefinedFacets: config.facets
        };
        me.changePageAction = function(){
            options.start = me.start;
            me.getMedia(options);
        };

        me.getMedia = function(options, reloadPager){
            RubedoSearchService.getMediaById(options).then(function(response){
                if(response.data.success){
                    me.count = response.data.count;
                    me.media = response.data.results.data;
                    if(reloadPager){
                        $compile(angular.element('paginator'))($scope);
                    }
                }
            });
        };

        me.getMedia(options, true);
    }]);

    module.controller("SearchResultsController",["$scope","$location","$routeParams","$compile","RubedoSearchService",
        function($scope,$location,$routeParams,$compile,RubedoSearchService){
            var me = this;
            var config = $scope.blockConfig;
            me.data = [];
            me.facets = [];
            me.activeFacets = [];
            me.start = 0;
            me.limit = config.pagesize?config.pagesize:12;
            var displayedFacets = JSON.parse(config.displayedFacets);
            var predefinedFacets = JSON.parse(config.predefinedFacets);
            var facetsId = ['objectType','type','damType','userType','author','userName','lastUpdateTime','query'];
            var operatorByFacetId = {};
            displayedFacets.forEach(function(facet){
                operatorByFacetId[facet.name] = facet.operator;
            });
            var options = {
                start: me.start,
                limit: me.limit,
                constrainToSite: config.constrainToSite,
                predefinedFacets: config.predefinedFacets,
                displayMode: config.displayMode,
                displayedFacets: config.displayedFacets
            };
            if($routeParams.query && $routeParams.query.length == 0){
                me.query = options.query = $location.search('query');
            } else if(predefinedFacets.query) {
                me.query = options.query = predefinedFacets.query;
            }
            me.changePageAction = function(){
                options.start = me.start;
                me.searchByQuery(options);
            };
            me.onSubmit = function(){
                me.start = 0;
                options = {
                    start: me.start,
                    limit: me.limit,
                    constrainToSite: config.constrainToSite,
                    predefinedFacets: config.predefinedFacets,
                    displayMode: config.displayMode,
                    displayedFacets: config.displayedFacets,
                    query: me.query
                };
                me.searchByQuery(options, true);
            };

            me.facetAdd = function(facetId,term){
                if(facetsId.indexOf(facetId)==-1){
                    if(!options.taxonomies){
                        options.taxonomies = {};
                    }
                    if(!options.taxonomies[facetId]){
                        options.taxonomies[facetId] = [];
                    }
                    options.taxonomies[facetId].push(term);
                } else {
                    if(!options[facetId+'[]']){
                        options[facetId+'[]'] = [];
                    }
                    options[facetId+'[]'].push(term);
                }
                me.start = 0;
                options.start = me.start;
                me.searchByQuery(options, true);
            };
            me.facetRemove = function(facetId,term){
                if(facetsId.indexOf(facetId)==-1){
                    options.taxonomies[facetId].splice(options.taxonomies[facetId].indexOf(term),1);
                } else if (facetId == 'query') {
                    delete options.query;
                } else {
                    options[facetId+'[]'].splice(options[facetId+'[]'].indexOf(term),1);
                }
                me.start = 0;
                options.start = me.start;
                me.searchByQuery(options, true);
            };
            me.searchByQuery = function(options, reloadPager){
                RubedoSearchService.searchByQuery(options).then(function(response){
                    if(response.data.success){
                        me.count = response.data.count;
                        me.data =  response.data.results.data;
                        me.facets = response.data.results.facets;
                        me.notRemovableTerms = [];
                        me.activeTerms = [];
                        var previousFacetId;
                        response.data.results.activeFacets.forEach(function(activeFacet){
                            activeFacet.terms.forEach(function(term){
                                var newTerm = {};
                                newTerm.term = term.term;
                                newTerm.label = term.label;
                                newTerm.facetId = activeFacet.id;
                                if(previousFacetId == activeFacet.id){
                                    newTerm.operator =' '+operatorByFacetId[activeFacet.id]+' ';
                                } else if (previousFacetId && me.notRemovableTerms.length != 0){
                                    newTerm.operator = ', ';
                                }
                                if(predefinedFacets.hasOwnProperty(activeFacet.id) && predefinedFacets[activeFacet.id]==term.term){
                                    me.notRemovableTerms.push(newTerm);
                                } else {
                                    me.activeTerms.push(newTerm);
                                }
                                previousFacetId = activeFacet.id;
                            });
                        });
                        if(reloadPager){
                            $compile(angular.element('paginator'))($scope);
                        }
                    }
                })
            };
            me.searchByQuery(options, true);
        }]);

})();
