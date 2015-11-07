  function noop () { }

  Rx.Observable.prototype.safeApply = function($scope, fn){
    fn = angular.isFunction(fn) ? fn : noop;

    return this
      .takeWhile(function () {
        return !$scope.$$destroyed;
      })
      .tap(function (data) {
        ($scope.$$phase || $scope.$root.$$phase) ?
          fn(data) :
          $scope.$apply(function () { fn(data); });
    });
  };
