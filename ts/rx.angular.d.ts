/**
 * Created by Giles Roadnight on 26/01/2016.
 */

///<reference path="../typings/tsd.d.ts" />

declare module Rx {

  export interface Observable<T> {
    safeApply( scope: ng.IScope, onNext?: (value: T) => void, onError?: (error: any) => void, onComplete?: () => void ): Observable<T>;

    digest( scope: ng.IScope, prop: string ): Observable<T>;
  }
}

declare module angular{

  export interface IObservableChange<T>{
    observable: Rx.Observable<T>;
    expression: string;
    value: T;
  }

  export interface IScope{
    $createObservableFunction<T>( functionName: string, listener: (data) => void ): Rx.Observable<T>;
    $digestObservables<T>( observables: {[key:string]:Rx.Observable<T>} ): Rx.Observable<IObservableChange<T>>;
    $eventToObservable<T>(eventName: string): Rx.Observable<T>;
    $toObservable<T>(watchExpression: (scope: ng.IScope) => void | string, objectEquality?:boolean ): Rx.Observable<T>;
  }
}
