angular.module("rubedoBlocks").lazy.controller("AudioController",["$scope","RubedoMediaService",function($scope,RubedoMediaService){
    var me=this;
    var config = $scope.blockConfig;
    var mediaId=config.audioFile;
    me.hasPlayed=false;
    me.displayMedia=function(){
        if (me.media&&me.media.originalFileId){
            me.jwSettings={
                primary:"flash",
                height:40,
                width:"100%",
                autostart:config.audioPlay,
                repeat:config.audioLoop,
                file:me.media.url
            };
            setTimeout(function(){
                jwplayer("audio"+me.media.id).setup(me.jwSettings);
                jwplayer("audio"+me.media.id).onPlay(function(){
                    if(!me.hasPlayed){
                        $scope.handleCSEvent("play");
                        me.hasPlayed=true;
                    }
                });
                $scope.clearORPlaceholderHeight();
            }, 200);
        }
    };
    if (mediaId){
        RubedoMediaService.getMediaById(mediaId).then(
            function(response){
                if (response.data.success){
                    me.media=response.data.media;
                    me.displayMedia();
                }
            }
        );
    }
}]);