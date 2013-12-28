
    rxModule
        .config(['$provide', function($provide){
            $provide.decorator('$rootScope', ['$delegate', function($delegate){

                Object.defineProperty($delegate.constructor.prototype, '$toObservable', {
                    value: function(watchExpression, objectEquality) {
                        var scope = this;
                        return Rx.Observable.create(function (observer) {
                            // Create function to handle old and new Value
                            function listener (newValue, oldValue) {
                                observer.onNext({ oldValue: oldValue, newValue: newValue });
                            }
                        
                            // Returns function which disconnects the $watch expression
                            var unbind = scope.$watch(watchExpression, listener, objectEquality);

                            var disposable = Rx.Disposable.create(unbind);

                            scope.$on('$destroy', function(){
                                disposable.dispose();
                            });

                            return disposable;
                        });
                    },
                    enumerable: false
                });


                Object.defineProperty($delegate.constructor.prototype, '$createObservableFunction', {
                    value: function(functionName, listener) {
                        var scope = this;

                        return Rx.Observable.create(function (observer) {
                            scope[functionName] = function () {
                                if ( undefined !== listener ) {
                                    observer.onNext(
                                        listener.apply(this, arguments));
                                } else if ( 1 === arguments.length ) {
                                    observer.onNext(arguments[0]);
                                } else {
                                    observer.onNext(arguments);
                                }
                            };

                            return function () {
                                // Remove our listener function from the scope.
                                delete scope[functionName];
                            };
                        });
                    },
                    enumerable: false
                });


                return $delegate;
            }]);
        }]);


