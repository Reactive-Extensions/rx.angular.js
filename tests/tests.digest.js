module('$rootScope.digest()');

asyncTest('assigns to simple scope properties', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  scope
    .$toObservable('testProperty')
    .debounceTime(500)
    .map(function(change) { return change.newValue + 1; })
    .digest(scope, 'testProperty2')
    .subscribe(function onNext(val) {
      start();
      equal(val, 2, 'digest() should pass the value through to observers');
      equal(scope.testProperty2, 2, 'digest() should update the given scope property');
    });

  scope.$apply(function () {
    scope.testProperty = 1;
  });

  expect(2);
});

asyncTest('assigns to more complex assignable expressions', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  var controller = scope.ctrl = {
    testProperty2: null
  };

  scope
    .$toObservable('testProperty')
    .debounceTime(500)
    .map(function(change) { return change.newValue + "®"; })
    .digest(scope, 'ctrl.testProperty2')
    .subscribe(function onNext(val) {
      start();
      equal(val, "1®", 'digest() should pass the value through to observers');
      equal(controller.testProperty2, "1®", 'digest() should update the given controller property');
    });

  scope.$apply(function () {
    scope.testProperty = 1;
  });

  expect(2);
});

asyncTest('sends an error if expression is not assignable', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  var controller = scope.ctrl = {
    testProperty2: null
  };

  scope
    .$toObservable('testProperty')
    .debounceTime(500)
    .map(function(change) { return change.newValue + 1; })
    .digest(scope, 'testProperty2 === 5')
    .subscribe(function onNext() {
      start();
      ok(false, 'onNext should not be called if expression is not assignable');
    }, function onError() {
      start();
      ok(true, 'onError should be called if expression is not assignable');
    });

  scope.$apply(function () {
    scope.testProperty = 1;
  });

  expect(1);
});
