module('safeApply');

asyncTest('calls $apply onNext', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  var source = new Rx.Subject();

  var result;

  source
    .debounce(500)
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

  source.onNext( 2 );

  expect(1);
});

asyncTest('calls $apply onError', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  var source = new Rx.Subject();

  var result;

  var expectedError = {details: "expected error details"};

  source
    .debounce(500)
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

  source.onError( expectedError );

  expect(1);
});

asyncTest('calls $apply onComplete', function () {
  var injector = angular.injector(['ng', 'rx']);

  var scope = injector.get('$rootScope').$new();

  var source = new Rx.Subject();

  var result;

  var expectedError = {};

  source
    .debounce(500)
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
  source.onNext( 2 );
  source.onCompleted();

  expect(1);
});
