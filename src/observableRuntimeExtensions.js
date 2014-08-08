rxModule.run(['$parse', function($parse) {

    observableProto.digest = function($scope, prop) {
        var propSetter = $parse(prop).assign;
        var unsubscribe = this.subscribe(function(e) {
            if (!$scope.$$phase) {
                $scope.$apply(
                    propSetter($scope, e)
                );
            }
            else {
                propSetter($scope, e);
            }
        });

        $scope.$on('$destroy', function() {
            unsubscribe.dispose();
        });
        return this;
    };

}]);