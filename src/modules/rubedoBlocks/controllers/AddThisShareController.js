angular.module("rubedoBlocks").lazy.controller('AddThisShareController',['$scope',function($scope){
    var me = this;
    var config = $scope.blockConfig;
    me.like = config.like == 1;
    me.disposition = config.disposition;
    me.class = 'addthis_toolbox';
    if(me.like){
        if(config.disposition == 'Horizontal'){
            me.class += ' addthis_default_style';
        } else {
            me.class += ' addthis_floating_style addthis_counter_style addthis-pos';
        }
    } else {
        if(config.disposition == 'Horizontal'){
            me.class += ' addthis_default_style';
            if(config.small == 1){
                me.class += ' addthis_32x32_style'
            }
        } else {
            me.class += ' addthis_floating_style';
            if(config.small == 0){
                me.class += ' addthis_16x16_style addthis-pos';
            } else {
                me.class += ' addthis_32x32_style addthis-pos'
            }
        }
    }
    me.loadAddThis = function(){
        addthis.toolbox('.addthis_toolbox');

    };
}]);