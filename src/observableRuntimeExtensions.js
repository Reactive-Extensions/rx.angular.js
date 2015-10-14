  rxModule.run(function($parse) {

    var DigestObservable = (function(__super__) {
      Rx.internals.inherits(DigestObservable, __super__);
      function DigestObservable(source, $scope, prop) {
        this.source = source;
        this.$scope = $scope;
        this.prop = prop;
        __super__.call(this);
      }

      DigestObservable.prototype.subscribeCore = function (o) {
        var propSetter = $parse(this.prop).assign;
        if (!propSetter) {
          return o.onError(new Error('Property or expression is not assignable.'));
        }

        var m = new Rx.SingleAssignmentDisposable();
        m.setDisposable(this.source.subscribe(new DigestObserver(o, this.$scope, propSetter)));
        this.$scope.$on('$destroy', function () { m.dispose(); });

        return m;
      };

      return DigestObservable;
    }(Rx.ObservableBase));

    var DigestObserver = (function(__super__) {
      Rx.internals.inherits(DigestObserver, __super__);
      function DigestObserver(o, $scope, propSetter) {
        this.o = o;
        this.$scope = $scope;
        this.propSetter = propSetter;
        __super__.call(this);
      }

      DigestObserver.prototype.next = function (x) {
        if (!this.$scope.$$phase) {
          this.$scope.$apply(this.propSetter(this.$scope, x));
        } else {
          this.propSetter(this.$scope, x);
        }
        this.o.onNext(x);
      };
      DigestObserver.prototype.error = function (e) { this.o.onError(e); };
      DigestObserver.prototype.completed = function () { this.o.onCompleted(); };

      return DigestObserver;
    }(Rx.internals.AbstractObserver));

    Rx.Observable.prototype.digest = function($scope, prop) {
      return new DigestObservable(this, $scope, prop);
    };
  });
