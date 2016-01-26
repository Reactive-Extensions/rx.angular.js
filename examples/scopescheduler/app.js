;(function() {
  angular.module('example', ['rx']) .controller('AppCtrl', function($scope, rx) {
    $scope.time = +new Date();

    var scheduler = new rx.ScopeScheduler($scope);

    rx.Observable.interval(1000, scheduler)
      .subscribe(function () {
        $scope.time = +new Date();
      });
  });
}());
