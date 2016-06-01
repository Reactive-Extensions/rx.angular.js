module('$rootScopeExtension');

//this doesn't feel right. We want to test whether the unbind function
//of a $watch was called.
//So what we do is, we redefine the $watch method so that we can
//intercept the unbind function to know if it was called or not.
var createScopeTestHelper = function(scope) {
  var _$watch = scope.$watch;

  var calledUnbind = false;

  scope.$watch = function (expression, objectEquality) {
    var unbind = _$watch.call(scope, expression, objectEquality);

    return function () {
      unbind();
      calledUnbind = true;
    };
  };

  return {
    calledUnbind: function () {
      return calledUnbind;
    }
  };
};

test('can subscribe', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  scope.testProperty = 0;

  var calledSubscribe = false;

  scope
    .$toObservable('testProperty')
    .subscribe(function(val){
        calledSubscribe = true;
    });

  scope.$apply(function(){
    scope.testProperty = 1;
  });

  ok(calledSubscribe);
});

test('dispose calls unbind function which was returned from $watch', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  var scopeTestHelper = createScopeTestHelper(scope);

  scope.testProperty = 0;

  var called = 0;

  var disposable = scope
    .$toObservable('testProperty')
    .subscribe(function(val){
        called++;
    });

  scope.$apply(function(){
      scope.testProperty = 1;
  });

  ok(called === 1);

  disposable.unsubscribe();

  scope.$apply(function(){
      scope.testProperty = 2;
  });

  ok(scopeTestHelper.calledUnbind(), 'called the unbind function');
  ok(called === 1, 'subscribe callback was only called once');
});

test('dispose calls unbind function which was returned from $watch', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  var scopeTestHelper = createScopeTestHelper(scope);

  scope.testProperty = 0;

  var called = 0;

  var disposable = scope
    .$toObservable('testProperty')
    .subscribe(function(val){
        called++;
    });

  scope.$destroy();

  ok(scopeTestHelper.calledUnbind(), 'called the unbind function');
});


test('can add observable function to scope', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  var calledSubscribe = false,
      calledWith;

  scope
    .$createObservableFunction('clickMe')
    .subscribe(function(val){
      calledSubscribe = true;
      calledWith = val;
    });

  scope.$apply(function(){
    scope.clickMe('test');
  });

  ok(calledSubscribe);
  ok(calledWith === 'test', 'created function was not called with correct parameters');
});

test('observable function removed from scope when disposed', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  var subscription = scope
      .$createObservableFunction('clickMe')
      .subscribe(function(val){});

  subscription.unsubscribe();

  ok(scope.clickMe === undefined);
});

test('can subscribe to event observable', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  var EVENT_NAME  = 'somethingHappened',
      PARAM1      = 'param1',
      PARAM2      = 'param2';

  scope
    .$eventToObservable(EVENT_NAME)
    .subscribe(function(data){
        equal(data[0].name, EVENT_NAME);
        equal(data[1], PARAM1);
        equal(data[2], PARAM2);
    });

  scope.$emit(EVENT_NAME, PARAM1, PARAM2);
});

asyncTest('$digestObservables runs digest when observables produce new values', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  scope.testProperty1 = 1;

  // Simulate 'controller as' scenario with ng-controller & directives.
  var controller = scope.ctrl = {
    testProperty2: null
  };

  var observables = {
    'testProperty1': Rx.Observable.interval(500)
      .map(function(val) { return val + 1; }),
    'ctrl.testProperty2': Rx.Observable.interval(1000)
      .map(function(val) { return val + 1; })
  };

  scope.$digestObservables(observables)
    .skip(3)
    .take(1)
    .subscribe(function(change) {
      start();
      equal(scope.testProperty1, 3, 'scope property value matches expected');
      equal(scope.ctrl.testProperty2, 1, 'controller property value matches expected');
      equal(change.expression, 'testProperty1', 'change contains correct "expression" property');
      equal(change.observable, observables.testProperty1, 'change contains correct "observable" property');
      equal(change.value, scope.testProperty1, 'change contains correct "value" property');
    });

  expect(5);
});
