# rx.angular.js <sup>v1.0.0</sup>

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
- [`digest`](#digestscope-fn)

[`$rootScope`](http://docs.angularjs.org/api/ng.$rootScope) Methods:
- [`$createObservableFunction`](#createobservablefunctionfunctionname-listener)
- [`$digestObservables`](#digestobservables)
- [`$eventToObservable`](#eventtoobservableeventname)
- [`$toObservable`](#toobservablewatchexpression-objectequality)

Schedulers:
- [`Rx.ScopeScheduler`](#rxscopescheduler)

* * *

### <a id="rx"></a>`rx`
<a href="#rx">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/factory.js "View in source")

Creates a factory for using RxJS.

#### Returns
*(Rx)*: The root of RxJS.

#### Example
```js
angular.module('rxexamples', ['rx'])
  .controller('AppCtrl', function($scope, rx) {

    $scope.counter = 0;

    rx.Observable.interval(1000)
      .safeApply(
        $scope,
        function (x) { $scope.counter = x; })
      .subscribe();

  });
```

### Location

File:
- [`/src/factory.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/factory.js)

Dist:
- [`rx.angular.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/dist/rx.angular.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx-angular`](https://www.npmjs.org/package/rx-angular)

Bower Packages:
- `angular-rx`

NuGet Packages:
- [`RxJS-Bridges-Angular`](http://www.nuget.org/packages/RxJS-Bridges-Angular)

Unit Tests:
- [`/tests/tests.factory.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/tests/factory.js)

* * *

### <a id="observeonscopescope-watchexpression-objectequality"></a>`observeOnScope(scope, watchExpression, [objectEquality])`
<a href="#observeonscopescope-watchexpression-objectequality">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/observeronscope.js "View in source")

Creates a factory which allows the user to observe a property on a given scope to check for old and new values.

#### Arguments
1. `scope` *(Scope)*: The scope to apply the watch function.
2. `watchExpression`: Expression that is evaluated on each `$digest` cycle. A change in the return value triggers a call to the listener.
    - `string`: Evaluated as expression
    - `function(scope)`: called with current scope as a parameter.
3. `[objectEquality]`: *(boolean)*: Compare object for equality rather than for reference.

#### Returns
*(Rx)*: The root of RxJS

#### Example
```js
angular.module('rxexamples', ['rx'])
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
- [`/src/observeronscope.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/observeronscope.js)

Dist:
- [`rx.angular.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/dist/rx.angular.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx-angular`](https://www.npmjs.org/package/rx-angular)

Bower Packages:
- `angular-rx`

NuGet Packages:
- [`RxJS-Bridges-Angular`](http://www.nuget.org/packages/RxJS-Bridges-Angular)

Unit Tests:
- [`/tests/tests.observeronscope.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/tests/observeronscope.js)

* * *


### <a id="safeapplyscope-fn"></a>`safeApply(scope, [onNext])`
<a href="#safeapplyscope-fn">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/safeApply.js "View in source")

Ensures a [`Scope.$digest()`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) is scheduled to be called after the given side-effect function is run. This is equivalent to a [`.do()`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/do.md) operator that automatically wraps its function in a [`Scope.$apply()`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply) if an apply is not already in progress.

#### Arguments
1. `scope` *(`$rootScope.Scope`)*: The scope to apply the `onNext` function with.
2. `[onNext]` *(`Function`)*: Function to invoke for each element in the observable sequence.

#### Returns

*(Observable)*: The source sequence with the side-effecting behavior applied.

#### Example
```js
angular.module('rxexamples', ['rx'])
  .controller('AppCtrl', function($scope, rx) {

    $scope.counter = 0;

    rx.Observable.interval(1000)
      .safeApply(
        $scope,
        function (x) { $scope.counter = x; })
      .subscribe();

  });
```

### Location

File:
- [`/src/safeApply.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/safeApply.js)

Dist:
- [`rx.angular.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/dist/rx.angular.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx-angular`](https://www.npmjs.org/package/rx-angular)

Bower Packages:
- `angular-rx`

NuGet Packages:
- [`RxJS-Bridges-Angular`](http://www.nuget.org/packages/RxJS-Bridges-Angular)

Unit Tests:
- [`/tests/tests.safeApply.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/tests/tests.safeApply.js)

* * *

### <a id="digestscope-fn"></a>`digest(scope, prop)`
<a href="#digestscope-fn">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/observableRuntimeExtensions.js "View in source")

Ensures a [`Scope.$digest()`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) is scheduled to be called after each element in the observable sequence is assigned to the given assignable expression / scope property. This is equivalent to a [`.safeApply()`](#safeapplyscope-fn) call that assigns to a scope or controller property.

#### Arguments
1. `scope` *(`$rootScope.Scope`)*: A scope to use as the context of the assignable expression.
2. `prop` *(`String`)*: An assignable expression, e.g. a scope property name.

#### Returns

*(Observable)*: The source sequence with the side-effecting behavior applied.

#### Example
```js
angular.module('rxexamples', ['rx'])
  .controller('AppCtrl', function($scope, rx) {

    $scope.counter = 0;

    rx.Observable.interval(1000)
      .digest(
        $scope,
        'counter'
      ).subscribe();

  });
```

### Location

File:
- [`/src/observableRuntimeExtensions.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/observableRuntimeExtensions.js)

Dist:
- [`rx.angular.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/dist/rx.angular.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx-angular`](https://www.npmjs.org/package/rx-angular)

Bower Packages:
- `angular-rx`

NuGet Packages:
- [`RxJS-Bridges-Angular`](http://www.nuget.org/packages/RxJS-Bridges-Angular)

Unit Tests:
- [`tests/tests.digest.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/tests/tests.digest.js)

* * *

### <a id="createobservablefunctionfunctionname-listener"></a>`$createObservableFunction(functionName, listener)`
<a href="#createobservablefunctionfunctionname-listener">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/$rootScopeExtensions.js)

Creates an observable from a given function.

#### Arguments
1. `functionName`: *(String)*: A function name to observe.
2. `[listener]`: *(Function)*: A listener function that gets executed.

#### Returns
*(Rx)*: A new Observable object with the watch expression in place.

#### Example
```js
angular.module('rxexamples', ['rx'])
  .controller('AppCtrl', function($scope) {

    $scope.$createObservableFunction('clickMe')
      .subscribe(function (name) {
        console.log(name);
      });

    $scope.$apply(function () {
      $scope.clickMe('RxJS');
    });

// => RxJS
```

### Location

File:
- [`/src/$rootScopeExtensions.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/$rootScopeExtensions.js)

Dist:
- [`rx.angular.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/dist/rx.angular.js)

Prerequisites:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx-angular`](https://www.npmjs.org/package/rx-angular)

Bower Packages:
- `angular-rx`

NuGet Packages:
- [`RxJS-Bridges-Angular`](http://www.nuget.org/packages/RxJS-Bridges-Angular)

Unit Tests:
- [`/tests/tests.$rootScopeExtensions.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/tests/$rootScopeExtensions.js)

* * *

### <a id="digestobservables"></a>`$digestObservables(scope, obj)`
<a href="#digestobservables">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/$rootScopeExtensions.js)

Digests the specified observables when they produce new values. The scope variable / assignable expression  specified by the observable's key is set to the new value.

#### Arguments
1. `obj`: *(`Object`)*: A map where keys are scope properties (assignable expressions) and values are observables.

#### Returns
*(`Observable`)*: Observable of change objects.

#### Example
```js
angular.module('rxexamples', ['rx'])
  .controller('AppCtrl', function($scope) {
    $scope.property1 = null;

    // Assume we're using ng-controller="AppCtrl as ctrl" in the template.
    this.property2 = null;

    var observables = {
      property1: Rx.Observable.interval(500)
        .map(function(val) { return val + 1; }),
      'ctrl.property2': Rx.Observable.interval(1000)
        .map(function(val) { return val + 1; })
    };

    $scope.$digestObservables(observables)
      .subscribe(function (change) {
        if (change.observable === observables.property1) {
          console.log('Next %s: %s, %s', change.expression, $scope.property1, change.value);
        } else if (change.observable === observables['ctrl.property2']) {
          console.log('Next %s: %s, %s', change.expression, this.property2, change.value);
        }
      }.bind(this));

// => Next property1: 1, 1
// => Next ctrl.property2: 1, 1
// => Next property1: 2, 2
// => Next property1: 3, 3
// => Next ctrl.property2: 2, 2
// ...
```

### Location

File:
- [`/src/$rootScopeExtensions.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/$rootScopeExtensions.js)

Dist:
- [`rx.angular.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/dist/rx.angular.js)

Prerequisites:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx-angular`](https://www.npmjs.org/package/rx-angular)

Bower Packages:
- `angular-rx`

NuGet Packages:
- [`RxJS-Bridges-Angular`](http://www.nuget.org/packages/RxJS-Bridges-Angular)

Unit Tests:
- [`/tests/tests.$rootScopeExtensions.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/tests/$rootScopeExtensions.js)

* * *

### <a id="eventtoobservableeventname"></a>`$eventToObservable(eventName)`
<a href="#eventtoobservableeventname">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/$rootScopeExtensions.js)

Creates an Observable from an event which is fired on the local $scope.
Expects an event name as the only input parameter.

#### Arguments
1. `eventName`: The event name to listen to.

#### Returns
*(Rx)*: A new Observable object with the watch for the event name.

#### Example
```js
angular.module('rxexamples', ['rx'])
  .controller('AppCtrl', function($scope) {

    $scope.$eventToObservable('nameChanged')
      .subscribe(function (data) {
        console.log('Event name %s', data.event.name);
        console.log('Additional arguments %s', data.additionalArguments);
      });

    $scope.$emit('nameChanged', 'foo', 'bar');

// => Event name nameChanged
// => Additional arguments foo, bar
```

### Location

File:
- [`/src/$rootScopeExtensions.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/$rootScopeExtensions.js)

Dist:
- [`rx.angular.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/dist/rx.angular.js)

Prerequisites:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx-angular`](https://www.npmjs.org/package/rx-angular)

Bower Packages:
- `angular-rx`

NuGet Packages:
- [`RxJS-Bridges-Angular`](http://www.nuget.org/packages/RxJS-Bridges-Angular)

Unit Tests:
- [`/tests/tests.$rootScopeExtensions.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/tests/$rootScopeExtensions.js)

* * *

### <a id="toobservablewatchexpression-objectequality"></a>`$toObservable(watchExpression, [objectEquality])`
<a href="#observeonscopescope-watchexpression-objectequality">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/$rootScopeExtensions.js)

Creates an observable from a watch expression.

#### Arguments
1. `watchExpression`: Expression that is evaluated on each `$digest` cycle. A change in the return value triggers a call to the listener.
    - `string`: Evaluated as expression
    - `function(scope)`: called with current scope as a parameter.
2. `[objectEquality]`: *(boolean)*: Compare object for equality rather than for reference.

#### Returns
*(Rx)*: A new Observable object with the watch expression in place.

#### Example
```js
angular.module('rxexamples', ['rx'])
  .controller('AppCtrl', function($scope) {

    $scope.$toObservable('name')
      .subscribe(function (name) {
        console.log(name);
      });

    $scope.$apply(function () {
      $scope.name = 'RxJS';
    });

// => RxJS
```

### Location

File:
- [`/src/$rootScopeExtensions.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/$rootScopeExtensions.js)

Dist:
- [`rx.angular.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/dist/rx.angular.js)

Prerequisites:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx-angular`](https://www.npmjs.org/package/rx-angular)

Bower Packages:
- `angular-rx`

NuGet Packages:
- [`RxJS-Bridges-Angular`](http://www.nuget.org/packages/RxJS-Bridges-Angular)

Unit Tests:
- [`/tests/tests.$rootScopeExtensions.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/tests/$rootScopeExtensions.js)

* * *

### <a id="rxscopescheduler"></a>`Rx.ScopeScheduler`
<a href="#rxscopescheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/scopescheduler.js)

Creates a scheduler that safely applies on the given scope for updates.

#### Example
```js
angular.module('rxexamples', ['rx'])
  .controller('AppCtrl', function($scope, rx) {

    $scope.time = Date.now();

    rx.Observable.interval(1000, new rx.ScopeScheduler($scope))
      .subscribe(function () { $scope.time = Date.now(); });
  });
```

### Location

File:
- [`/src/scopescheduler.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/src/scopescheduler.js)

Dist:
- [`rx.angular.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/dist/rx.angular.js)

Prerequisites:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx-angular`](https://www.npmjs.org/package/rx-angular)

Bower Packages:
- `angular-rx`

NuGet Packages:
- [`RxJS-Bridges-Angular`](http://www.nuget.org/packages/RxJS-Bridges-Angular)

Unit Tests:
- [`/tests/tests.scopescheduler.js`](https://github.com/Reactive-Extensions/rx.angular.js/blob/master/tests/scopescheduler.js)

* * *
