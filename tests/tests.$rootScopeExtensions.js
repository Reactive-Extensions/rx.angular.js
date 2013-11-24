module('$rootScopeExtension');

test('All Pass', function () {
    var injector = angular.injector(['ng', 'rx']);

    var scope = injector.get('$rootScope').$new();

    scope.testProperty = 0;

    var calledSubscribe = false;

    scope
        .$toObservable('testProperty')
        .subscribe(function(val){
            calledSubscribe = true;
        });

    scope.$apply(function(){
        scope.testProperty = 1;
    });

    ok(calledSubscribe);
});