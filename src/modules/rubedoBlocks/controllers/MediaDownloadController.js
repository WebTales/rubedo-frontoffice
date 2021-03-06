angular.module("rubedoBlocks").lazy.controller('MediaDownloadController',['$scope','RubedoMediaService',function($scope,RubedoMediaService){
    var me = this;
    var config = $scope.blockConfig;
    var options = {
        mediaId: config.documentId,
        contentId: config.introduction
    };
    RubedoMediaService.getMediaById(options.mediaId, options).then(function(response){
        if(response.data.success){
            me.media =  response.data.media;
            me.intro = null;
            if(response.data.intro&&response.data.intro.content) {
                me.intro = response.data.intro.content;
            }
            $scope.clearORPlaceholderHeight();
        }
    });
}]);