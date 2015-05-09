  /**
   * @ngdoc service
   * @name rx.rx
   *
   * @requires $window
   *
   * @description
   * Factory service that exposes the global `Rx` object to the Angular world.
   */
  rxModule.factory('rx', function($window) {
    $window.Rx || ($window.Rx = Rx);

    function createObservableFunction(self, functionName, listener) {
          return observableCreate(function (observer) {
              self[functionName] = function () {
                  if (listener) {
                      observer.onNext(listener.apply(this, arguments));
                  } else if (arguments.length === 1) {
                      observer.onNext(arguments[0]);
                  } else {
                      observer.onNext(arguments);
                  }
              };

              return function () {
                  // Remove our listener function from the self.
                  delete self[functionName];
              };
          }).publish().refCount();
      }

      $window.Rx.createObservableFunction = createObservableFunction;

    return $window.Rx;
  });
