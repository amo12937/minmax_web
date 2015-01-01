(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName).factory("" + moduleName + ".Com.Base", [
      "$timeout", "" + moduleName + ".PlayerBase", function($timeout, PlayerBase) {
        return function(name, boardMaster, maxDepth, delay) {
          var self;
          if (maxDepth == null) {
            maxDepth = 7;
          }
          if (delay == null) {
            delay = 0;
          }
          self = PlayerBase(name);
          self.play = function(callback) {
            return $timeout(function() {
              var pos;
              pos = self.getChosen(maxDepth);
              boardMaster.select(pos);
              return callback(boardMaster.isFinished());
            }, delay);
          };
          return self;
        };
      }
    ]);
  })("amo.minmax.Player");

}).call(this);

//# sourceMappingURL=base.js.map
