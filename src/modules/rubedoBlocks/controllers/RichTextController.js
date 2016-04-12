angular.module("rubedoBlocks").lazy.controller("RichTextController",["$scope","$sce","RubedoContentsService",function($scope, $sce,RubedoContentsService){
    var me = this;
    var config = $scope.blockConfig;
    $scope.fieldInputMode=false;
    $scope.$watch('rubedo.fieldEditMode', function(newValue) {
        $scope.fieldEditMode=me.content&&me.content.readOnly ? false : newValue;

    });
    me.getContentById = function (contentId){
        if(config.fromFront){
            me.content = config.content;
            $scope.fieldEntity=angular.copy(me.content.fields);
            $scope.fieldLanguage=me.content.locale;
            $scope.clearORPlaceholderHeight();
        } else {
            var options = {
                siteId: $scope.rubedo.current.site.id,
                pageId: $scope.rubedo.current.page.id
            };
            RubedoContentsService.getContentById(contentId).then(
                function(response){
                    if(response.data.success){
                        me.content=response.data.content;
                        $scope.fieldEntity=angular.copy(me.content.fields);
                        $scope.fieldLanguage=me.content.locale;
                        $scope.clearORPlaceholderHeight();
                    }
                }
            )
        }
    };
    if (config.contentId || config.content){
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
            function(response){
                if (response.data.success){
                    me.content.version = response.data.version;
                    $scope.rubedo.addNotification("success",$scope.rubedo.translate("Block.Success", "Success !"),$scope.rubedo.translate("Blocks.Contrib.Status.ContentUpdated", "Content updated"));
                } else {
                    $scope.rubedo.addNotification("danger",$scope.rubedo.translate("Block.Error", "Error !"),$scope.rubedo.translate("Blocks.Contrib.Status.UpdateError", "Content update error"));
                }
            },
            function(response){
                $scope.rubedo.addNotification("danger",$scope.rubedo.translate("Block.Error", "Error !"),$scope.rubedo.translate("Blocks.Contrib.Status.UpdateError", "Content update error"));
            }
        );
    };
    $scope.registerFieldEditChanges=me.registerEditChanges;
}]);