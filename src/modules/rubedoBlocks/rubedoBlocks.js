/**
 * Module that manages blocks
 */
(function(){
    var defaultModules = ['rubedoDataAccess', 'lrInfiniteScroll','rubedoFields','snap','mgcrea.ngStrap','angular-inview'];
    var modulesArray = window.rubedoConfig.extensionAngularModules?defaultModules.concat(window.rubedoConfig.extensionAngularModules):defaultModules;
    var module = angular.module('rubedoBlocks',modulesArray);


    module.config(function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
        module.lazy = {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            filter: $filterProvider.register,
            factory: $provide.factory,
            service: $provide.service
        };
    });

    var themePath="/theme/"+window.rubedoConfig.siteTheme;

    blocksConfig = {
        "image": {
            "template": "/templates/blocks/image.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/ImageController.js"]
        },
        "blockNotFound": {
            "template": "/templates/blocks/blockNotFound.html"
        },
        "navigation": {
            "template": "/templates/blocks/navigation.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/MenuController.js"]
        },
        "verticalNavigation": {
            "template": "/templates/blocks/verticalNavigation.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/MenuController.js"]
        },
        "contentList": {
            "template": "/templates/blocks/contentList.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/ContentListController.js","/src/modules/rubedoBlocks/directives/PaginatorDirective.js"]
        },
        "productList": {
            "template": "/templates/blocks/productList.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/ProductListController.js","/src/modules/rubedoBlocks/directives/PaginatorDirective.js"]
        },
        "authentication": {
            "template": "/templates/blocks/authentication.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/AuthenticationController.js"]
        },
        "simpleText": {
            "template": "/templates/blocks/simpleText.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/RichTextController.js"]
        },
        "richText": {
            "template": "/templates/blocks/richText.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/RichTextController.js"]
        },
        "contentDetail": {
            "template": "/templates/blocks/contentDetail.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/ContentDetailController.js","/src/modules/rubedoBlocks/directives/DisqusDirective.js"]
        },
        "calendar": {
            "template": "/templates/blocks/calendar.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/CalendarController.js"],
            "externalDependencies":['/components/jquery/fullCalendar/lib/jquery-ui.custom.min.js','/components/jquery/fullCalendar/fullcalendar.min.js','/components/jquery/fullCalendar/lang/en-gb.js','/components/jquery/fullCalendar/lang/fr.js']
        },
        "development": {
            "template": "/templates/blocks/development.html"
        },
        "customTemplate": {
            "template": "/templates/blocks/customTemplate.html"
        },
        "carrousel": {
            "template": "/templates/blocks/carousel.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/CarouselController.js"],
            "externalDependencies":['/components/OwlFonk/OwlCarousel/owl-carousel/owl.carousel.min.js']
        },
        "imageGallery": {
            "template": "/templates/blocks/gallery.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/GalleryController.js","/src/modules/rubedoBlocks/directives/PaginatorDirective.js"]
        },
        "damList": {
            "template": "/templates/blocks/mediaList.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/MediaListController.js","/src/modules/rubedoBlocks/directives/PaginatorDirective.js"]
        },
        "searchResults": {
            "template": "/templates/blocks/searchResults.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/SearchResultsController.js","/src/modules/rubedoBlocks/directives/PaginatorDirective.js"],
            "externalDependencies":['/components/jquery/fullCalendar/lib/jquery-ui.custom.min.js','/components/jquery/fullCalendar/fullcalendar.min.js','/components/jquery/fullCalendar/lang/en-gb.js','/components/jquery/fullCalendar/lang/fr.js']
        },
        "userProfile": {
            "template": "/templates/blocks/userProfile.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/UserProfileController.js"]
        },
        "externalMedia": {
            "template": "/templates/blocks/externalMedia.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/ExternalMediaController.js"]
        },
        "searchForm": {
            "template": "/templates/blocks/searchForm.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/SearchFormController.js"]
        },
        "breadcrumb": {
            "template": "/templates/blocks/breadcrumb.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/BreadcrumbController.js"]
        },
        "languageMenu": {
            "template": "/templates/blocks/languageMenu.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/LanguageMenuController.js"]
        },
        "directory": {
            "template": "/templates/blocks/directory.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/DirectoryController.js","/src/modules/rubedoBlocks/directives/PaginatorDirective.js"],
            "externalDependencies":['/components/jquery/fullCalendar/lib/jquery-ui.custom.min.js','/components/jquery/fullCalendar/fullcalendar.min.js','/components/jquery/fullCalendar/lang/en-gb.js','/components/jquery/fullCalendar/lang/fr.js']
        },
        "audio": {
            "template": "/templates/blocks/audio.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/AudioController.js"]
        },
        "video": {
            "template": "/templates/blocks/video.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/VideoController.js"]
        },
        "siteMap": {
            "template": "/templates/blocks/siteMap.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/SiteMapController.js"]
        },
        "twitter": {
            "template": "/templates/blocks/twitter.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/TwitterController.js"]
        },
        "geoSearchResults": {
            "template": "/templates/blocks/geoSearchResults.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/GeoSearchResultsController.js"],
            "externalDependencies":['/components/jquery/fullCalendar/lib/jquery-ui.custom.min.js','/components/jquery/fullCalendar/fullcalendar.min.js','/components/jquery/fullCalendar/lang/en-gb.js','/components/jquery/fullCalendar/lang/fr.js']

        },
        "addThis": {
            "template": "/templates/blocks/addThisShare.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/AddThisShareController.js"],
            "externalDependencies":['//s7.addthis.com/js/300/addthis_widget.js']
        },
        "resource": {
            "template": "/templates/blocks/mediaDownload.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/RichTextController.js","/src/modules/rubedoBlocks/controllers/MediaDownloadController.js"]
        },
        "addThisFollow": {
            "template": "/templates/blocks/addThisFollow.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/AddThisFollowController.js"],
            "externalDependencies":['//s7.addthis.com/js/300/addthis_widget.js']
        },
        "signUp": {
            "template": "/templates/blocks/signUp.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/RichTextController.js","/src/modules/rubedoBlocks/controllers/SignUpController.js"]
        },
        "imageMap": {
            "template": "/templates/blocks/imageMap.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/ImageMapController.js"],
            "externalDependencies":['/components/stowball/jQuery-rwdImageMaps/jquery.rwdImageMaps.min.js']
        },
        "contact": {
            "template": "/templates/blocks/contact.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/ContactController.js"]
        },
        "protectedResource": {
            "template": "/templates/blocks/mediaProtectedDownload.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/RichTextController.js","/src/modules/rubedoBlocks/controllers/MediaProtectedDownloadController.js"]
        },
        "mailingList": {
            "template": "/templates/blocks/mailingListSuscribe.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/MailingListSubscribeController.js"]
        },
        "unsubscribe": {
            "template": "/templates/blocks/mailingListUnsuscribe.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/MailingListUnsubscribeController.js"]
        },
        "d3Script": {
            "template": "/templates/blocks/d3Script.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/D3ScriptController.js"],
            "externalDependencies":['/components/mbostock/d3/d3.min.js']
        },
        "shoppingCart": {
            "template": "/templates/blocks/shoppingCart.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/ShoppingCartController.js"]
        },
        "checkout": {
            "template": "/templates/blocks/checkout.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/CheckoutController.js", "/src/modules/rubedoBlocks/controllers/AuthenticationController.js", "/src/modules/rubedoBlocks/controllers/RichTextController.js"]
        },
        "userOrders": {
            "template": "/templates/blocks/userOrders.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/UserOrdersController.js"]
        },
        "orderDetail": {
            "template": "/templates/blocks/orderDetail.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/OrderDetailController.js"]
        },
        "productSearch": {
            "template": "/templates/blocks/productSearch.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/ProductSearchController.js","/src/modules/rubedoBlocks/directives/PaginatorDirective.js"],
            "externalDependencies":['/components/jquery/fullCalendar/lib/jquery-ui.custom.min.js','/components/jquery/fullCalendar/fullcalendar.min.js','/components/jquery/fullCalendar/lang/en-gb.js','/components/jquery/fullCalendar/lang/fr.js']

        },
        "category": {
            "template": "/templates/blocks/category.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/CategoryController.js"]
        },
        "contentContribution": {
            "template": "/templates/blocks/contentContribution.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/ContentContributionController.js","/src/modules/rubedoBlocks/directives/ChosenDirective.js"]
        },
        "megaMenu": {
            "template": "/templates/blocks/megaMenu.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/MegaMenuController.js"]
        },
        "rssFeed": {
            "template": "/templates/blocks/rssFeed.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/RSSFeedController.js"]
        },
        "recommendedContents": {
            "template": "/templates/blocks/recommendedContents.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/RecommendedContentsController.js","/src/modules/rubedoBlocks/directives/PaginatorDirective.js"]
        },
        "insightsStats": {
            "template": "/templates/blocks/insightsStats.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/InsightsStatsController.js"]
        },
        "insightsRepartition": {
            "template": "/templates/blocks/insightsRepartition.html",
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/InsightsRepartitionController.js"]
        }
    };


    var responsiveClasses = {
        phone:"xs",
        tablet:"sm",
        desktop:"md",
        largeDesktop:"lg"
    };

    mongoIdRegex = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

    module.factory('RubedoBlockTemplateResolver', function() {
        var serviceInstance={};
        serviceInstance.getTemplate=function(bType,bConfig){
            if (bConfig.customTemplate){
                return (themePath+blocksConfig.customTemplate.template);
            } else if (bType=="navigation"&&bConfig.style&&bConfig.style=="Vertical") {
                return (themePath+blocksConfig.verticalNavigation.template);
            } else if (blocksConfig[bType]){
                if (blocksConfig[bType].absoluteUrl){
                    return (blocksConfig[bType].template);
                } else {
                    return (themePath+blocksConfig[bType].template);
                }
            } else {
                return (themePath+blocksConfig.blockNotFound.template);
            }
        };
        return serviceInstance;
    });
    var mimifiedBlocksDependency=false;
    module.factory('RubedoBlockDependencyResolver', function() {
        var serviceInstance={};
        serviceInstance.getDependencies=function(bTypeArray){
            var dependenciesArray=[ ];
            angular.forEach(bTypeArray,function(bType){
                if (blocksConfig[bType]){
                    if (blocksConfig[bType].externalDependencies){
                        angular.forEach(blocksConfig[bType].externalDependencies,function(dependency){
                            if (dependenciesArray.indexOf(dependency)<0){
                                dependenciesArray.push(dependency);
                            }
                        });
                    }
                    if (blocksConfig[bType].internalDependencies&&!window.rubedoConfig.isMimified){
                        angular.forEach(blocksConfig[bType].internalDependencies,function(dependency){
                            var dependencyPath=blocksConfig[bType].absoluteUrl?dependency:themePath+dependency;
                            if (dependenciesArray.indexOf(dependencyPath)<0){
                                dependenciesArray.push(dependencyPath);
                            }
                        });
                    }
                }
            });
            if (window.rubedoConfig.isMimified){
                if (!mimifiedBlocksDependency) {
                    var allBlockDependencies=[];
                    angular.forEach(blocksConfig,function(block){
                        angular.forEach(block.internalDependencies,function(dependencyPath) {
                            if (allBlockDependencies.indexOf(dependencyPath) < 0) {
                                allBlockDependencies.push(dependencyPath);
                            }
                        });
                    });
                    mimifiedBlocksDependency=themePath+"/js/rubedo-all-blocks.js?blockconfig="+angular.toJson(allBlockDependencies);
                }
                dependenciesArray.push(mimifiedBlocksDependency);

            }
            return (dependenciesArray);
        };
        return serviceInstance;
    });

    module.factory('RubedoPageComponents', function() {
        var serviceInstance={};
        serviceInstance.getRowTemplate=function(customTemplate){
            if (customTemplate){
                return(themePath+"/templates/customRow.html");
            }  else {
                return(themePath+"/templates/row.html");
            }
        };
        serviceInstance.getColumnTemplate=function(customTemplate){
            if (customTemplate){
                return(themePath+"/templates/customColumn.html");
            }  else {
                return(themePath+"/templates/column.html");
            }
        };
        serviceInstance.getColumnClass=function(span,offset,stackThreshold){
            if (!stackThreshold){
                stackThreshold="sm"
            }
            return ("col-"+stackThreshold+"-"+span+" col-"+stackThreshold+"-offset-"+offset);
        };
        serviceInstance.resolveResponsiveClass=function(responsiveConfig){
            var hiddenArray=[ ];
            angular.forEach(responsiveConfig,function(value,key){
                if (value===false){
                    hiddenArray.push("hidden-"+responsiveClasses[key]);
                }
            });
            return (hiddenArray.join(" "));
        };
        return serviceInstance;
    });

    var isACrawler=false;
    if(navigator.userAgent&&(navigator.userAgent.indexOf("PhantomJS")>-1||navigator.userAgent.indexOf("Prerender")>-1)){
        isACrawler=true;
    }
    var windowType=false;
    var determineWindowType=function(){
        if (window.innerWidth>=1200){
            return "largeDesktop";
        } else if (window.innerWidth>=992){
            return "desktop";
        } if (window.innerWidth>=768){
            return "tablet";
        } else {
            return "phone";
        }
    };
    if (window.innerWidth){
        windowType=determineWindowType();
        $(window).resize(function(){
            windowType=determineWindowType();
        });
    }
    var defaultMinHeight=100;
    var determineGenericBlockHeight=function(blockType,blockConfig){
        switch(blockType) {
            case "image":
            case "carrousel":
                return blockConfig.imageHeight ? blockConfig.imageHeight : defaultMinHeight;
                break;
            case "video":
                return blockConfig.videoHeight ? blockConfig.videoHeight : defaultMinHeight;
                break;
            case "imageGallery":
                return blockConfig.imageThumbnailHeight ? blockConfig.imageThumbnailHeight : defaultMinHeight;
                break;
            case "externalMedia":
                return blockConfig.maxHeight ? blockConfig.maxHeight : defaultMinHeight;
                break;
            case "searchResults":
            case "productSearch":
            case "directory":
            case "contentContribution":
            case "signUp":
            case "orderDetail":
            case "checkout":
                return 500;
                break;
            case "contentList":
            case "productList":
                return blockConfig.summaryHeight&&blockConfig.columns&&blockConfig.pageSize ? Math.round(blockConfig.pageSize/blockConfig.columns)*(blockConfig.summaryHeight+50) : 300;
                break;
            case "geoSearchResults":
                return blockConfig.height ? blockConfig.height : 600;
                break;
            default:
                return defaultMinHeight;
        }
    };

    //generic block directive
    module.directive("rubedoBlock",function(){
        return {
            restrict:"E",
            templateUrl:themePath+"/templates/rubedoBlock.html",
            controller: ['$scope', function($scope) {
                var me=this;
                $scope.loadModalContent=false;
                $scope.blockConfig=$scope.block.configBloc;
                me.minBlockHeight=$scope.block.configBloc.blockMinHeight;
                me.responsiveSettings=$scope.block.responsive ? $scope.block.responsive : {};
                if (!me.minBlockHeight&&!isACrawler&&$scope.rubedo.current.site.optimizedRender&&(!windowType||me.responsiveSettings[windowType]!==false)){
                    if ($scope.blockConfig.orPlaceholderMinHeight){
                        me.minBlockHeight=$scope.blockConfig.orPlaceholderMinHeight;
                    } else {
                        me.minBlockHeight=determineGenericBlockHeight($scope.block.bType,$scope.blockConfig);
                    }
                    me.minHeightIsArtificial=true;
                }
                me.isInView=false;
                $scope.getBlockMinHeight=function(){
                    return(me.minBlockHeight);
                };
                $scope.$on("RubedoShowModal",function(event,args){
                    if (args&&args.block&&args.block==$scope.block.code&&$scope.blockConfig.renderAsEventModal){
                        angular.element('#modalblock'+$scope.block.id).appendTo('body').modal('show');
                        $scope.loadModalContent=true;
                    }
                });
                $scope.blockEnterFOV=function(){
                    me.isInView=true;
                };
                $scope.handleCSEvent=function(event,args){
                    if($scope.blockConfig.csEventConfig&&$scope.blockConfig.csEventConfig[event]&&$scope.blockConfig.csEventConfig[event]!=""){
                        $scope.rubedo.fireCSEvent($scope.blockConfig.csEventConfig[event],args);
                    }
                };
                $scope.clearORPlaceholderHeight=function(){
                    if(me.minHeightIsArtificial){
                         setTimeout(function(){ delete(me.minBlockHeight);me.minHeightIsArtificial=false; }, 100);
                    }
                };
                $scope.canDisplayBlock=function(){
                    return (isACrawler||((!$scope.rubedo.current.site.optimizedRender||$scope.blockConfig.bypassOptimizer||me.isInView)&&(!windowType||me.responsiveSettings[windowType]!==false)));
                };
                if($scope.rubedo.current&&$scope.rubedo.current.UXParams&&$scope.rubedo.current.UXParams.initialEvents&&$scope.rubedo.current.UXParams.initialEvents[$scope.block.code]&&$scope.rubedo.current.UXParams.initialEvents[$scope.block.code].RubedoShowModal){
                    $scope.loadModalContent=true;
                    setTimeout(function(){
                        angular.element('#modalblock'+$scope.block.id).appendTo('body').modal('show');

                    },300)
                }
            }]
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
                        var includeId=false;
                        if (tpl.indexOf("document.write(")>-1) {
                            includeId="custom"+Math.random().toString(36).substring(7);
                            tpl = tpl.replace("document.write(", "angular.element("+includeId+").append(");
                        }
                        el = $compile( tpl )( scope );
                        element.html("");
                        if (includeId){
                            element.attr("id",includeId);
                        }
                        element.append( el );
                    }
                });
            }
        };
    }]);

    module.directive('showtab',
        function () {
            return {
                link: function (scope, element, attrs) {
                    element.click(function(e) {
                        e.preventDefault();
                        $(element).tab('show');
                    });
                }
            };
        });

    module.directive('rubedoEvent',
        function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.click(function(e) {
                        if(attrs.rubedoEvent&&attrs.rubedoEvent!=""){
                            scope.rubedo.fireCSEvent(attrs.rubedoEvent);
                        }
                    });
                }
            };
        });

    module.directive('scrollTo', function ($location, $anchorScroll) {
        return {
            restrict: 'A',
            link: function(scope, $elm, attrs) {
                var idToScroll = attrs.href;
                $elm.bind('click', function(event) {
                    event.preventDefault();
                    var location = attrs.scrollTo.substr(1);
                    $location.hash(location);
                    var $target;
                    if (idToScroll) {
                        $target = angular.element(idToScroll);
                    } else {
                        $target = $elm;
                    }
                    angular.element("body").animate({scrollTop: $target.offset().top}, "slow");
                });
            }
        }
    });

    module.directive('executeJs',function(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs ){
                var fct = attrs.executeJs;
                var ready = 0;
                var attrsLength = 0;
                angular.forEach(attrs.$attr,function(){attrsLength++;});
                angular.forEach(attrs.$attr,function(attr, attrKey){
                    attrs.$observe(attrKey,function(newAttr){
                        if(newAttr !== undefined){
                            ready ++;
                            if(ready == attrsLength){
                                window[fct]();
                            }
                        }
                    });
                })
            }
        }
    });

    module.filter('unsafe', function($sce) { return $sce.trustAsHtml; });

    module.directive("datehistogramFacet",function(){
        return {
            restrict:"E",
            templateUrl:themePath+"/templates/blocks/facets/datehistogramFacet.html",
            controller: ['$scope','$element','$route', function($scope,$element,$route) {
                var me=this;
                $scope.init = function(){
                    me.calendar = $element.find(".dhf-holder");
                    me.calendar.fullCalendar({
                        lang: $route.current.params.lang,
                        timezone: false,
                        header:{
                            left:   'prev',
                            center: 'title',
                            right:  'next'
                        },
                        height:200,
                        eventClick: function(calEvent, jsEvent, view) {
                            $scope.clickOnFacets($scope.facet.id, calEvent.termId);
                        },
                        viewRender: function(view){
                            var newEvents = [];
                            angular.forEach($scope.facet.terms,function(term){
                                var event = {
                                    termId:term.term,
                                    start:moment(term.term).format('YYYY-MM-DD'),
                                    end:moment(term.term).format('YYYY-MM-DD'),
                                    title:term.count
                                };
                                newEvents.push(event);
                            });
                                me.calendar.fullCalendar('removeEvents');
                                me.calendar.fullCalendar('addEventSource', newEvents);
                                me.calendar.fullCalendar('refetchEvents');
                        }

                    });
                };
                $scope.$watch('facet.terms.length', function() {
                    if(me.calendar){
                        var newEvents = [];
                        angular.forEach($scope.facet.terms,function(term){
                            var event = {
                                termId:term.term,
                                start:moment(term.term).format('YYYY-MM-DD'),
                                end:moment(term.term).format('YYYY-MM-DD'),
                                title:term.count
                            };
                            newEvents.push(event);
                        });
                        me.calendar.fullCalendar('removeEvents');
                        me.calendar.fullCalendar('addEventSource', newEvents);
                        me.calendar.fullCalendar('refetchEvents');
                    }
                });
            }]
        };
    });

})();
