module('manageScope');

asyncTest('manages scope', function () {

  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  var count = 0;

  Rx.Observable.interval(1)
    .let(Rx.manageScope(scope))
    .subscribe(function(v) {
      count += 1;
      scope.value = v;
    }
  );

  var total = 0;
  setTimeout(function() {

    scope.$destroy();
    total = count;

    setTimeout(function() {

      start();

      ok(
        total === count,
        "Expected " + total + " calls, but received " + count
      );

    }, 100);

  }, 100);

  expect(1);
});
