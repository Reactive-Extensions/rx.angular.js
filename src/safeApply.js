  Rx.Observable.prototype.safeApply = function($scope, fn){
    fn = angular.isFunction(fn) ? fn : noop;

    return this.tap(function (data) {
      ($scope.$$phase || $scope.$root.$$phase) ?
        fn(data) :
        $scope.$apply(function () { fn(data); });
    });
  };
