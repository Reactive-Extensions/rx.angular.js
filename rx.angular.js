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
    
    var Rx = window.Rx,
        observable = Rx.Observable,
        observableProto = observable.prototype,
        observableCreate = observable.create;

    // Utilities
    var toString = {}.toString,
        slice = Array.prototype.slice;

    function isFunction (fn) {
        return toString.call(fn) === '[object Function]';
    }
    function noop () {}


/**
 * @ngdoc overview
 * @name rx
 *
 * @description
 * The `rx` module contains essential components for reactive extension bindings
 * for Angular apps.
 *
 * Installation of this module is just a cli command away:
 *
 * <pre>
 * bower install rx-angular
 * <pre>
 *
 * Simply declare it as dependency of your app like this:
 *
 * <pre>
 * var app = angular.module('myApp', ['rx']);
 * </pre>
 */
var rxModule = angular.module('rx', []);

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
        if(!$window.Rx) {
            throw new Error("Rx is not defined!");
        }
        return $window.Rx;
    });

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
        /**
         * @ngdoc service
         * @name rx.$rootScope
         *
         * @requires $delegate
         *
         * @description
         * `$rootScope` decorator that extends the existing `$rootScope` service
         * with additional methods. These methods are Rx related methods, such as
         * methods to create observables or observable functions.
         */
        $provide.decorator('$rootScope', ['$delegate', function($delegate) {

            Object.defineProperties($delegate.constructor.prototype, {
                /**
                 * @ngdoc property
                 * @name rx.$rootScope.$toObservable
                 *
                 * @description
                 * Provides a method to create observable methods.
                 */
                '$toObservable': {
                    /**
                     * @ngdoc function
                     * @name rx.$rootScope.$toObservable#value
                     *
                     * @description
                     * Creates an observable from a watchExpression. 
                     *
                     * @param {(function|string)} watchExpression A watch expression.
                     * @param {boolean} objectEquality Compare object for equality.
                     *
                     * @return {object} Observable.
                     */
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
                    /**
                     * @ngdoc property
                     * @name rx.$rootScope.$toObservable#enumerable
                     *
                     * @description
                     * Enumerable flag.
                     */
                    enumerable: false
                },
                /**
                 * @ngdoc property
                 * @name rx.$rootScope.$eventToObservable
                 *
                 * @description
                 * Provides a method to create observable methods.
                 */
                '$eventToObservable': {
                    /**
                     * @ngdoc function
                     * @name rx.$rootScope.$eventToObservable#value
                     *
                     * @description
                     * Creates an Observable from an event which is fired on the local $scope.
                     * Expects an event name as the only input parameter.
                     *
                     * @param {string} event name
                     *
                     * @return {object} Observable object.
                     */
                    value: function(eventName) {
                        var scope = this;
                        return observableCreate(function (observer) {
                            function listener () {
                                var data = {
                                    'event': arguments[0],
                                    'additionalArguments': slice.call(arguments, 1)
                                };

                                observer.onNext(data);
                            }

                            // Returns function which disconnects from the event binding
                            var unbind = scope.$on(eventName, listener);

                            var disposable = Rx.Disposable.create(unbind);

                            scope.$on('$destroy', function(){
                                disposable.dispose();
                            });

                            return disposable;
                        });
                    },
                    /**
                     * @ngdoc property
                     * @name rx.$rootScope.$eventToObservable#enumerable
                     *
                     * @description
                     * Enumerable flag.
                     */
                    enumerable: false
                },
                /**
                 * @ngdoc property
                 * @name rx.$rootScope.$createObservableFunction
                 *
                 * @description
                 * Provides a method to create obsersables from functions.
                 */
                '$createObservableFunction': {
                    /**
                     * @ngdoc function
                     * @name rx.$rootScope.$createObservableFunction#value
                     *
                     * @description
                     * Creates an observable from a given function.
                     *
                     * @param {string} functionName A function name to observe.
                     * @param {function} listener A listener function that gets executed.
                     *
                     * @return {function} Remove listener function.
                     */
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
                    /**
                     * @ngdoc property
                     * @name rx.$rootScope.$createObservableFunction#enumerable
                     *
                     * @description
                     * Enumerable flag.
                     */
                    enumerable: false
                }
            });

            return $delegate;
        }]);
    }]);

}.call(this));