'use strict';
var angularMeteorUtils = angular.module('angular-meteor.utils', []);

angularMeteorUtils.service('$meteorUtils', [
  function () {
    this.getCollectionByName = function(string){
      return Mongo.Collection.get(string);
    };
    this.autorun = function(scope, fn) {
      // wrapping around Deps.autorun
      var comp = Tracker.autorun(function(c) {
        fn(c);

        // this is run immediately for the first call
        // but after that, we need to $apply to start Angular digest
        if (!c.firstRun) setTimeout(function() {
          // wrap $apply in setTimeout to avoid conflict with
          // other digest cycles
          scope.$apply();
        }, 0);
      });
      // stop autorun when scope is destroyed
      scope.$on('$destroy', function() {
        comp.stop();
      });
      // return autorun object so that it can be stopped manually
      return comp;
    };
  }]);

angularMeteorUtils.run(['$rootScope', '$meteorUtils',
  function($rootScope, $meteorUtils) {
    Object.getPrototypeOf($rootScope).$meteorAutorun = function(fn) {
      return $meteorUtils.autorun(this, fn);
    };
}]);
