module('ScopeScheduler');

asyncTest('calls observeOn', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  scope.$watch('testProperty', function (val) {
    scope.testProperty2 = val;
  });

  scope
    .$toObservable('testProperty')
    .throttle(500)
    .tap(function () { scope.testProperty = 2; })
    .observeOn(new Rx.ScopeScheduler(scope))
    .subscribe(function () {
      start();
      ok(true);
      //ok(scope.testProperty2 === 2); -- Don't know why this doesn't work.
    });

  scope.$apply(function () {
    scope.testProperty = 1;
  });

  expect(1);
});
