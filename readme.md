# rx.angular.js - Reactive Extensions Bindings for AngularJS

This library serves as a bridge between the [Reactive Extensions for JavaScript (RxJS)](https://github.com/Reactive-Extensions/RxJS) and [AngularJS](http://angularjs.org/).

With this library, you will be able to do such things as easily watch values as they change, as observable sequences such as:

```js
angular.module('observeOnScopeApp', ['rx'])
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

	<div class="container" ng-app="observeOnScopeApp" ng-controller="AppCtrl">
	  <h2>Reactive Angular</h2>
	  <ul class="list-unstyled">
	    <li>observedChange {{observedChange}}</li>
	    <li>newValue: {{newValue}</li>
	    <li>oldValue: {{oldValue}}</li>
	  </ul>  
	  
	  <input type="text" ng-model="name" />
	</div>

This only scratches the surface of what is possible when you combine the two libraries together.

## Dive In! ##

You can find the documentation [here](https://github.com/Reactive-Extensions/rx.angular.js/tree/master/doc) as well as examples [here](https://github.com/Reactive-Extensions/rx.angular.js/tree/master/examples) and plenty of [unit tests](https://github.com/Reactive-Extensions/rx.angular.js/tree/master/tests).

## Getting Started

There are a number of ways to get started with RxJS. 

### Download the Source

    git clone https://github.com/Reactive-Extensions/rx.angular.js.git
    cd ./rx.angular.js

## Contributing ##

There are lots of ways to [contribute](https://github.com/Reactive-Extensions/rx.angular.js/wiki/Contributions) to the project, and we appreciate our [contributors](https://github.com/Reactive-Extensions/rx.angular.js/wiki/Contributors).

You can contribute by reviewing and sending feedback on code checkins, suggesting and trying out new features as they are implemented, submit bugs and help us verify fixes as they are checked in, as well as submit code fixes or code contributions of your own. Note that all code submissions will be rigorously reviewed and tested by the Rx Team, and only those that meet an extremely high bar for both quality and design/roadmap appropriateness will be merged into the source.

## License ##

Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you
may not use this file except in compliance with the License. You may
obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing permissions
and limitations under the License.