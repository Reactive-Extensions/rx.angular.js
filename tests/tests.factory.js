module('factory');

test('get rx factory', function () {
  var injector = angular.injector(['ng', 'rx']);

  var $window = injector.get('$window');

  ok($window.Rx);
});
