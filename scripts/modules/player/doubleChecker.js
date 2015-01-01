(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName).factory("" + moduleName + ".Com.DoubleChecker", [
      "" + moduleName + ".Com.Base", "" + moduleName + ".Com.AlphaBeta", "" + moduleName + ".Com", function(ComBase, AlphaBeta, MinMax) {
        return function(name, boardMaster, maxDepth, delay) {
          var ab, mm, self;
          if (maxDepth == null) {
            maxDepth = 7;
          }
          if (delay == null) {
            delay = 0;
          }
          ab = AlphaBeta(name, boardMaster, maxDepth, delay);
          mm = MinMax(name, boardMaster, maxDepth, delay);
          self = ComBase(name, boardMaster, maxDepth, delay);
          self.getChosen = function(depth) {
            var abPos, mmPos;
            abPos = ab.getChosen(depth);
            mmPos = mm.getChosen(depth);
            if (!(abPos[0] === mmPos[0] && abPos[1] === mmPos[1])) {
              console.log("abPos = (" + abPos + "), mmPos = (" + mmPos + ")");
            }
            return abPos;
          };
          return self;
        };
      }
    ]);
  })("amo.minmax.Player");

}).call(this);

//# sourceMappingURL=doubleChecker.js.map
