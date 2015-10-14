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

    var CreateObservableFunction = (function(__super__) {
      Rx.internals.inherits(CreateObservableFunction, __super__);
      function CreateObservableFunction(self, name, fn) {
        this._self = self;
        this._name = name;
        this._fn = fn;
        __super__.call(this);
      }

      CreateObservableFunction.prototype.subscribeCore = function (o) {
        var fn = this._fn;
        this._self[this._name] = function () {
          var len = arguments.length, args = new Array(len);
          for (var i = 0; i < len; i++) { args[i] = arguments[i]; }

          if (angular.isFunction(fn)) {
            var result = tryCatch(fn).apply(this, args);
            if (result === errorObj) { return o.onError(result.e); }
            o.onNext(result);
          } else if (args.length === 1) {
            o.onNext(args[0]);
          } else {
            o.onNext(args);
          }
        };

        return new InnerDisposable(this._self, this._name);
      };

      function InnerDisposable(self, name) {
        this._self = self;
        this._name = name;
        this.isDisposed = false;
      }

      InnerDisposable.prototype.dispose = function () {
        if (!this.isDisposed) {
          this.isDisposed = true;
          delete this._self[this._name];
        }
      };

      return CreateObservableFunction;
    }(Rx.ObservableBase));

    Rx.createObservableFunction = function (self, functionName, listener) {
      return new CreateObservableFunction(self, functionName, listener).publish().refCount();
    };

    return $window.Rx;
  });
