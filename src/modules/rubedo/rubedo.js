(function(){
    var app = angular.module('rubedo', ['rubedoDataAccess','rubedoBlocks','ngRoute']);
    var current={
        page:{
            blocks:[]
        },
        site:{

        }
    };


    app.config(function($routeProvider,$locationProvider) {
        $routeProvider.when('/:lang/:routeline*?', {
                template: '<ng-include src="pageBodyCtrl.currentBodyTemplate"></ng-include>',
                controller:'PageBodyController',
                controllerAs: "pageBodyCtrl"
            }).otherwise({
                templateUrl:'/components/webtales/rubedo-frontoffice/templates/404.html'
        });
        $locationProvider.html5Mode(true);

    });

    app.controller("RubedoController",['RubedoBlockTemplateResolver','RubedoImageUrlService',function(RubedoBlockTemplateResolver,RubedoImageUrlService){
        this.current=current;
        this.blockTemplateResolver=RubedoBlockTemplateResolver;
        this.imageUrl=RubedoImageUrlService;
    }]);

    app.controller("PageBodyController",['RubedoPagesService',function(RubedoPagesService){
        var me=this;
        RubedoPagesService.getPageByCurrentRoute().then(function(response){
            if (response.data.success){
                current.page=angular.copy(response.data.page);
                current.site=angular.copy(response.data.site);
                me.currentBodyTemplate='/components/webtales/rubedo-frontoffice/templates/defaultPageBody.html';
            }
        },function(response){
            if (response.status==404){
                current.page={
                    text:"404",
                    blocks:[]
                };
                me.currentBodyTemplate='/components/webtales/rubedo-frontoffice/templates/404.html';
            }
            // @TODO handle other error codes or use generic error template
        });

    }]);


})();