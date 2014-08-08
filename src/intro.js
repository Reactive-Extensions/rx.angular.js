;(function (root, factory) {
  var freeExports = typeof exports == 'object' && exports &&
  (typeof root == 'object' && root && root == root.global && (window = root), exports);

  // Because of build optimizers
  if (typeof define === 'function' && define.amd) {
    define(['rx', 'angular', 'exports'], function (Rx, angular, exports) {
      root.Rx = factory(root, exports, Rx, jQuery);
      return root.Rx;
    });
  } else if (typeof module == 'object' && module && module.exports == freeExports) {
    module.exports = factory(root, module.exports, require('rx'), require('angular'));
  } else {
    root.Rx = factory(root, {}, root.Rx, angular);
  }
}(this, function (global, exp, Rx, angular, undefined) {
