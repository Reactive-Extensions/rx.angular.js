module('$rootScopeExtension');

//this doesn't feel right. We want to test whether the unbind function
//of a $watch was called.
//So what we do is, we redefine the $watch method so that we can
//intercept the unbind function to know if it was called or not.
var createScopeTestHelper = function(scope){
    var _$watch = scope.$watch;

    var calledUnbind = false;

    scope.$watch = function(expression, objectEquality){
        var unbind = _$watch.call(scope, expression, objectEquality);

        return function(){
            unbind();
            calledUnbind = true;
        };
    };

    return {
        calledUnbind: function(){
            return calledUnbind;
        }
    }
};

test('can subscribe', function () {
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

    var scopeTestHelper = createScopeTestHelper(scope);

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

    ok(scopeTestHelper.calledUnbind(), 'called the unbind function');
    ok(called === 1, 'subscribe callback was only called once');
});

test('dispose calls unbind function which was returned from $watch', function () {
    var injector = angular.injector(['ng', 'rx']);

    var scope = injector.get('$rootScope').$new();

    var scopeTestHelper = createScopeTestHelper(scope);

    scope.testProperty = 0;

    var called = 0;

    var disposable = scope
                        .$toObservable('testProperty')
                        .subscribe(function(val){
                            called++;
                        });

    scope.$destroy();

    ok(scopeTestHelper.calledUnbind(), 'called the unbind function');
    ok(disposable.m.current.isDisposed,'called dispose on the disposable');
});


test('can add observable function to scope', function () {
    var injector = angular.injector(['ng', 'rx']);

    var scope = injector.get('$rootScope').$new();

    var calledSubscribe = false,
        calledWith;

    scope
        .$createObservableFunction('clickMe')
        .subscribe(function(val){
            calledSubscribe = true;
            calledWith = val;
        });

    scope.$apply(function(){
        scope.clickMe('test');
    });

    ok(calledSubscribe);
    ok(calledWith === 'test',
       'created function was not called with correct parameters');
});

test('observable function removed from scope when disposed', function () {
    var injector = angular.injector(['ng', 'rx']);

    var scope = injector.get('$rootScope').$new();

    var subscription = scope
        .$createObservableFunction('clickMe')
        .subscribe(function(val){});

    subscription.dispose();

    ok(scope.clickMe === undefined);
});
