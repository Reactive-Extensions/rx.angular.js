  function noop () { }

  Rx.Observable.prototype.safeApply = function($scope, onNext, onError, onComplete){
    onNext = angular.isFunction(onNext) ? onNext : noop;
    onError = angular.isFunction(onError) ? onError : noop;
    onComplete = angular.isFunction(onComplete) ? onComplete : noop;

    return this
      .takeWhile(function () {
        return !$scope.$$destroyed;
      })
      .tap(
        function (data){
          ($scope.$$phase || $scope.$root.$$phase) ?
            onNext(data) :
            $scope.$apply(function () { onNext(data); });
        },
        function (error){
          ($scope.$$phase || $scope.$root.$$phase) ?
            onError(error) :
            $scope.$apply(function () { onError(error); });
        },
        function (){
          ($scope.$$destroyed || $scope.$$phase || $scope.$root.$$phase) ?
            onComplete() :
            $scope.$apply(function () { onComplete(); });
        });
  };
