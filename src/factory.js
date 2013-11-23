    rxModule.factory('rx', function($window) {
        if(!$window.Rx) {
            throw new Error("Rx is not defined!");
        }
        return $window.Rx;
    });
