module('safeApply');

asyncTest('calls $apply', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  scope.$watch('testProperty', function (val) {
    scope.testProperty2 = val;
  });

  scope
    .$toObservable('testProperty')
    .debounce(500)
    .safeApply(scope, function (val) {
      scope.testProperty = 2;
    })
    .subscribe(function () {
      start();
      ok(scope.testProperty2 === 2);
    });

  scope.$apply(function () {
    scope.testProperty = 1;
  });

  expect(1);
});
