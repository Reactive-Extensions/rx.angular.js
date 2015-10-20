  /**
  * @ngdoc service
  * @name rx.observeOnSope
  *
  * @requires rx.rx
  *
  * @description
  * An observer function that returns a function for a given `scope`,
  * `watchExpression` and `objectEquality` object. The returned function
  * delegates to an Angular watcher.
  *
  * @param {object} scope Scope object.
  * @param {(string|object)} watchExpression Watch expression.
  * @param {boolean} objectEquality Object to compare for object equality.
  *
  * @return {function} Factory function that creates obersables.
  */
  rxModule.factory('observeOnScope', function(rx) {
    var ObserveOnScope = (function(__super__) {
      rx.internals.inherits(ObserveOnScope, __super__);
      function ObserveOnScope(scope, expr, eq) {
        this._scope = scope;
        this._expr = expr;
        this._eq = eq;
        __super__.call(this);
      }

      function createListener(o) {
        return function listener(newValue, oldValue) {
          o.onNext({ oldValue: oldValue, newValue: newValue });
        };
      }

      ObserveOnScope.prototype.subscribeCore = function (o) {
        var listener = createListener(o);
        return new InnerDisposable(this._scope.$watch(this._expr, listener, this._eq));
      };

      function InnerDisposable(fn) {
        this._fn = fn;
        this.isDisposed = false;
      }

      InnerDisposable.prototype.dispose = function () {
        if (!this.isDisposed) {
          this._fn();
        }
      };

      return ObserveOnScope;
    }(rx.ObservableBase));

    return function(scope, watchExpression, objectEquality) {
      return new ObserveOnScope(scope, watchExpression, objectEquality);
    };
  });
