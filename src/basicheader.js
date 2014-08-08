  var observable = Rx.Observable,
    observableProto = observable.prototype,
    observableCreate = observable.create,
    disposableCreate = Rx.Disposable.create,
    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
    CompositeDisposable = Rx.CompositeDisposable,
    Scheduler = Rx.Scheduler,
    noop = Rx.helpers.noop;

  // Utilities
  var toString = Object.prototype.toString,
    slice = Array.prototype.slice;

  function isFunction (fn) {
    return toString.call(fn) === '[object Function]';
  }