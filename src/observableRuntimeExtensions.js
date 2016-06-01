  rxModule.run(function($parse) {

    var DigestObserver = (function(__super__) {
      RxNg.inherits(DigestObserver, __super__);
      function DigestObserver(o, $scope, propSetter) {
        this.o = o;
        this.$scope = $scope;
        this.propSetter = propSetter;
        __super__.call(this);
      }

      DigestObserver.prototype.next = function (x) {
        if (!this.$scope.$$phase) {
          var _this = this;
          this.$scope.$apply(function() {
            _this.propSetter(_this.$scope, x);
          });
        } else {
          this.propSetter(this.$scope, x);
        }
        this.o.next(x);
      };
      DigestObserver.prototype.error = function (e) { this.o.error(e); };
      DigestObserver.prototype.completed = function () { this.o.completed(); };

      return DigestObserver;
    }(Rx.Subscriber));

    Rx.Observable.prototype.digest = function($scope, prop) {
      var self = this;

      var subscribeCore = function (o) {
        var propSetter = $parse(prop).assign;
        if (!propSetter) {
          return o.error(new Error('Property or expression is not assignable.'));
        }

        var m = self.subscribe(new DigestObserver(o, $scope, propSetter));
        $scope.$on('$destroy', function () { m.unsubscribe(); });

        return m;
      };

      return Rx.Observable.create(subscribeCore);
    };
  });
