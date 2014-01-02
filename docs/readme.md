# rx.angular.js <sup>v0.0.3</sup>

Reactive Extensions (Rx) is a library for composing asynchronous and event-based programs using observable sequences and Array#extras style operators.

Data sequences can take many forms, such as a stream of data from a file or web service, web services requests, system notifications, or a series of events such as user input.

Reactive Extensions represents all these data sequences as observable sequences. An application can subscribe to these observable sequences to receive asynchronous notifications as new data arrive. 

This library provides bridges to the popular [Angular JS](http://angularjs.org) library.

## Reactive Extensions Binding for the AngularJS API

This section contains the reference documentation for the Reactive Extensions for AngularJS library.

Factories:
- [`rx`](#rx)
- [`observeOnScope`](#observeonscopescope-watchexpression-objectequality)

Observable Methods:
- [`safeApply`](#safeapplyscope-fn)

[`$rootScope`](http://docs.angularjs.org/api/ng.$rootScope) Methods:
- [`$createObservableFunction`](#createobservablefunctionfunctionname-listener)
- ['$toObservable'](#toobservablewatchexpression-objectequality)

* * *

### <a id="rx"></a>`rx`
<a href="#rx">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/factory.js#L1-L6 "View in source") 

Creates a factory for using RxJS.

#### Returns
*(Rx)*: The root of RxJS

#### Example
```js
angular.module('example', ['rx'])
    .controller('AppCtrl', function($scope, rx) {

        $scope.counter = 0;

        rx.Observable.interval(1000)
            .safeApply(
                $scope, 
                function (x) {
                    $scope.counter = x;
                })
            .subscribe();

    });
```

### Location

File:
- /src/factory.js

Dist:
- rx.angular.js

* * *

### <a id="observeonscopescope-watchexpression-objectequality"></a>`observeOnScope(scope, watchExpression, [objectEquality])`
<a href="#observeonscopescope-watchexpression-objectequality">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/observeronscope.js#L1-L13 "View in source") 

Creates a factory which allows the user to observe a property on a given scope to check for old and new values.

#### Arguments
1. `scope` *(Scope)*: The scope to apply the watch function.
2. `watchExpression`: Expression that is evaluated on each `$digest` cycle. A change in the return value triggers a call to the listener.
    - `string`: Evaluated as expression
    - `function(scope)`: called with current scope as a parameter.
3. `[objectEquality]`: *(Function)*: Compare object for equality rather than for reference.

#### Returns
*(Rx)*: The root of RxJS

#### Example
```js
angular.module('observeOnScopeApp', ['rx'])
    .controller('AppCtrl', function($scope, observeOnScope) {
        
        observeOnScope($scope, 'name').subscribe(function(change) {
            $scope.observedChange = change;
            $scope.newValue = change.newValue;
            $scope.oldValue = change.oldValue;
        });
    });
```

### Location

File:
- /src/observeronscope.js

Dist:
- rx.angular.js

* * *