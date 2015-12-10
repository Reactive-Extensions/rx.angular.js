[![Build Status](https://travis-ci.org/Reactive-Extensions/rx.angular.js.png)](https://travis-ci.org/Reactive-Extensions/rx.angular.js)
[![GitHub version](http://img.shields.io/github/tag/reactive-extensions/rx.angular.js.svg)](https://github.com/Reactive-Extensions/rx.angular.js)
[![NPM version](http://img.shields.io/npm/v/rx-angular.svg)](https://npmjs.org/package/rx-angular)
[![Downloads](http://img.shields.io/npm/dm/rx-angular.svg)](https://npmjs.org/package/rx-angular)
[![NuGet](http://img.shields.io/nuget/v/RxJS-Bridges-Angular.svg)](http://www.nuget.org/packages/RxJS-Bridges-Angular/)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
# `rx.angular.js` - Reactive Extensions Bindings for AngularJS

This library serves as a bridge between the [Reactive Extensions for JavaScript (RxJS)](https://github.com/Reactive-Extensions/RxJS) and [AngularJS](http://angularjs.org/).

With this library, you will be able to do such things as easily watch values as they change, as observable sequences such as:

```js
angular.module('example', ['rx'])
  .controller('AppCtrl', function($scope, observeOnScope) {

    // Listen for changes on the name
    observeOnScope($scope, 'name').subscribe(function(change) {
      $scope.observedChange = change;
      $scope.newValue = change.newValue;
      $scope.oldValue = change.oldValue;
    });
  });
```

And with your HTML markup you can use it like this:
```html
<div class="container" ng-app="example" ng-controller="AppCtrl">
  <h2>Reactive Angular</h2>
  <ul class="list-unstyled">
    <li>observedChange {{observedChange}}</li>
    <li>newValue: {{newValue}}</li>
    <li>oldValue: {{oldValue}}</li>
  </ul>  

  <input type="text" ng-model="name" />
</div>
```
Another example is where we can create an Observable sequence from such things ng-click expressions where we can search Wikipedia:

```js
angular.module('example', ['rx'])
  .controller('AppCtrl', function($scope, $http, rx) {

    function searchWikipedia (term) {
      return rx.Observable
        .fromPromise($http({
          url: "http://en.wikipedia.org/w/api.php?&callback=JSON_CALLBACK",
          method: "jsonp",
          params: {
            action: "opensearch",
            search: term,
            format: "json"
          }
        }))
        .map(function(response){ return response.data[1]; });             
    }

    $scope.search = '';
    $scope.results = [];

    /*
      Creates a "click" function which is an observable sequence instead of just a function.
    */
    $scope.$createObservableFunction('click')
      .map(function () { return $scope.search; })
      .flatMapLatest(searchWikipedia)
      .subscribe(function(results) {
        $scope.results = results;
      });
  });
```

And the HTML markup you can simply just use a ng-click directive much as you have before, but now it is an Observable sequence.
```html
<div class="container" ng-app="example" ng-controller="AppCtrl">

  <input type="text" ng-model="search">
  <button ng-click="click()">Search</button>

  <ul>
    <li ng-repeat="result in results">{{result}}</li>
  </ul>

</div>
```
This only scratches the surface of what is possible when you combine the two libraries together.

## Community Examples ##

There are a growing number of community samples using RxJS and Angular.js, including:
- [ninya.io](http://www.ninya.io/) - [Code](https://github.com/ninya-io/ninya.io)

## Dive In! ##

Please check out:

 - [Our Code of Conduct](https://github.com/Reactive-Extensions/RxJS/tree/master/code-of-conduct.md)
 - [The full documentation](https://github.com/Reactive-Extensions/rx.angular.js/tree/master/docs)
 - [Our many great examples](https://github.com/Reactive-Extensions/rx.angular.js/tree/master/examples)
 - [Our design guidelines](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/designguidelines)
 - [Our contribution guidelines](https://github.com/Reactive-Extensions/RxJS/tree/master/contributing.md)
 - [Our complete Unit Tests](https://github.com/Reactive-Extensions/rx.angular.js/tree/master/tests)

## Getting Started

There are a number of ways to get started with RxJS.

### Download the Source
```bash
$ git clone https://github.com/Reactive-Extensions/rx.angular.js.git
$ cd ./rx.angular.js
```
### Installing with [NPM](https://npmjs.org/)
```bash
npm install rx-angular
npm install -g rx-angular
```
### Installing with [Bower](http://bower.io/)
```bash
bower install angular-rx
```
### Installing with [Jam](http://jamjs.org/)
```bash
jam install rx-angular
```
### Installing All of RxJS via [NuGet](http://nuget.org/)
```PowerShell
PM> Install-Package RxJS-Bridges-Angular
```
## License ##

Copyright (c) Microsoft.  All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you
may not use this file except in compliance with the License. You may
obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing permissions
and limitations under the License.
