(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName).factory("" + moduleName + ".Man", [
      "$q", "" + moduleName + ".PlayerBase", function($q, PlayerBase) {
        return function(name, boardMaster) {
          var deferred, self;
          deferred = null;
          self = PlayerBase(name);
          self.choice = function(p) {
            if (!deferred) {
              return;
            }
            if (!boardMaster.selectable(p)) {
              return;
            }
            deferred.resolve(p);
            return deferred = null;
          };
          self.play = function(callback) {
            var promise;
            deferred = $q.defer();
            promise = deferred.promise;
            promise.then(function(p) {
              boardMaster.select(p);
              return callback(boardMaster.isFinished());
            });
          };
          return self;
        };
      }
    ]);
  })("amo.minmax.Player");

}).call(this);

//# sourceMappingURL=man.js.map
