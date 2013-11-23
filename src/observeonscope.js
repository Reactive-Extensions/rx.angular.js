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
