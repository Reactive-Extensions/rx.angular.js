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

    Rx.createObservableFunction = function (self, functionName, listener) {
      var subscribeCore = function (o) {
        self[functionName] = function () {
          var len = arguments.length, args = new Array(len);
          for (var i = 0; i < len; i++) { args[i] = arguments[i]; }

          if (angular.isFunction(listener)) {
            var result = tryCatch(listener).apply(this, args);
            if (result === errorObj) { return o.error(result.e); }
            o.next(result);
          } else if (args.length === 1) {
            o.next(args[0]);
          } else {
            o.next(args);
          }
        };

        return function() {
          delete self[functionName];
        };
      };
      return Rx.Observable.create(subscribeCore).publish().refCount();
    };

    return $window.Rx;
  });
