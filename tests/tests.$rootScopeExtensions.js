module('$rootScopeExtension');

test('can subscibe', function () {
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

test('dispose calls unbind function which was returned from $watch', function () {
    var injector = angular.injector(['ng', 'rx']);

    var scope = injector.get('$rootScope').$new();

    var calledUnbind = false;

    var _$watch = scope.$watch;

    //this doesn't feel right. We want to test that the unbind function
    //which is returned from $watch() will be called once we call
    //disposable.dispose().
    //So what we do is, we redefine the $watch method so that we can
    //intercept the unbind function to know if it was called or not.
    scope.$watch = function(expression, objectEquality){
        var unbind = _$watch.call(scope, expression, objectEquality);

        return function(){
            unbind();
            calledUnbind = true;
        };
    };

    scope.testProperty = 0;

    var called = 0;

    var disposable = scope
                        .$toObservable('testProperty')
                        .subscribe(function(val){
                            called++;
                        });

    scope.$apply(function(){
        scope.testProperty = 1;
    });

    ok(called === 1);

    disposable.dispose();

    scope.$apply(function(){
        scope.testProperty = 2;
    });

    ok(calledUnbind, 'called the unbind function');
    ok(called === 1, 'subscribe callback was only called once');
});