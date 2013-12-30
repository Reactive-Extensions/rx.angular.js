// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

;(function (undefined) {

    var objectTypes = {
        'boolean': false,
        'function': true,
        'object': true,
        'number': false,
        'string': false,
        'undefined': false
    };

    var root = (objectTypes[typeof window] && window) || this;

    /** Detect free variable `exports` */
    var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

    /** Detect free variable `module` */
    var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports` */
    var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

    /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
    var freeGlobal = objectTypes[typeof global] && global;
    if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
        root = freeGlobal;
    }

    // Headers
    var observable = Rx.Observable,
        observableProto = observable.prototype,
        observableCreate = observable.create;

    // Utilities
    var toString = {}.toString;
    function isFunction (fn) {
        return toString.call(fn) === '[object Function]';
    }
    function noop () {}

    var rxModule = angular.module('rx', []);

    rxModule.factory('rx', function($window) {
        if(!$window.Rx) {
            throw new Error("Rx is not defined!");
        }
        return $window.Rx;
    });

    rxModule.factory('observeOnScope', function(rx) {
        return function(scope, watchExpression, objectEquality) {
            return rx.Observable.create(function (observer) {
                // Create function to handle old and new Value
                function listener (newValue, oldValue) {
                    observer.onNext({ oldValue: oldValue, newValue: newValue });
                }
            
                // Returns function which disconnects the $watch expression
                return scope.$watch(watchExpression, listener, objectEquality);
            });
        };
    });

    observableProto.safeApply = function($scope, fn){

        fn = isFunction(fn) ? fn : noop;

        return this.doAction(function(data){
            ($scope.$$phase || $scope.$root.$$phase) ? fn(data) : $scope.$apply(function(){
                fn(data);
            });
        });
    };
    rxModule.config(['$provide', function($provide) {
        $provide.decorator('$rootScope', ['$delegate', function($delegate) {

            Object.defineProperties($delegate.constructor.prototype, {
                '$toObservable': {
                    value: function(watchExpression, objectEquality) {
                        var scope = this;
                        return observableCreate(function (observer) {
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
                },
                '$createObservableFunction': {
                    value: function(functionName, listener) {
                        var scope = this;

                        return observableCreate(function (observer) {
                            scope[functionName] = function () {
                                if (listener) {
                                    observer.onNext(listener.apply(this, arguments));
                                } else if (arguments.length === 1) {
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
                }
            });

            return $delegate;
        }]);
    }]);

}.call(this));