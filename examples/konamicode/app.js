;(function (undefined) {

    angular.module('example', ['rx'])
      .directive('konamiCode', function(rx) {

        function keyCode (e) { return e.keyCode; }

        var konamiArray = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

        return {
          restrict: 'A',
          scope: { konamiCode: '&' },
          link: function(scope, element, attrs) {
            var konamiCode = rx.Observable.fromArray(konamiArray);
            var ObservableElementKeyUp = rx.Observable.fromEvent(element, 'keyup');

            ObservableElementKeyUp
              .map(keyCode)
              .windowWithCount(konamiArray.length)
              .flatMap(function (x) { return x.sequenceEqual(konamiCode); })
              .filter(angular.identity)
              .subscribe(function () { scope.$apply(scope.konamiCode); });
          }
        };
      })
      .controller('AppCtrl', function($scope) {

        $scope.result = function(data) {
          $scope.konami = true;
        };

      });

}.call(this));
