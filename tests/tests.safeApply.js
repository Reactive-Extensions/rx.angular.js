module('safeApply');

asyncTest('calls $apply onNext', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  var source = new Rx.Subject();

  var result;

  source
    .debounceTime(500)
    .safeApply(scope,
      function (val) {
        result = val;
      },
      function (error) {
        result = error;
      }
    )
    .subscribe(function () {
      start();
      ok(result === 2);
    });

  source.next( 2 );

  expect(1);
});

asyncTest('calls $apply onError', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  var source = new Rx.Subject();

  var result;

  var expectedError = {details: "expected error details"};

  source
    .debounceTime(500)
    .safeApply(scope,
      function (val) {
        result = val;
      },
      function (error) {
        result = error;
      }
    )
    .subscribe(
      function(){},
      function() {
      start();
      ok(result === expectedError);
    });

  source.error( expectedError );

  expect(1);
});

asyncTest('calls $apply onComplete', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  var source = new Rx.Subject();

  var result;

  var expectedError = {};

  source
    .debounceTime(500)
    .safeApply(scope,
      function (val) {
        result = val;
      },
      function (error) {
        result = error;
      },
      function () {
        result = 4;
      }
    )
    .subscribe(
      function(){},
      function(){},
      function () {
      ok(result === 4);
    });

  start();
  source.next( 2 );
  source.complete();

  expect(1);
});
