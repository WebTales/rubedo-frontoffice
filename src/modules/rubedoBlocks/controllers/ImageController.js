angular.module("rubedoBlocks").lazy.controller("ImageController",["$scope","$http","RubedoPagesService", function($scope,$http,RubedoPagesService){
    var me = this;
    var config = $scope.blockConfig;
    me.imageTitle = "";
    if (config.externalURL){
        me.url=config.externalURL;
    } else if (config.imageLink&&mongoIdRegex.test(config.imageLink)){
        RubedoPagesService.getPageById(config.imageLink).then(function(response){
            if (response.data.success){
                me.url=response.data.url;
            }
        });
    }
    
    if(config.imageFile) {
        $http.get("/api/v1/media/" + config.imageFile).then(
            function(response) {
                if(response.data.success) {
                    me.imageTitle = response.data.media.fields.title;
                    $scope.clearORPlaceholderHeight();
                }
            }
        );
    }

}]);
