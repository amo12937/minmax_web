(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName, ["ng"]).factory("" + moduleName + ".PlayerBase", function() {
      var idSeed;
      idSeed = 0;
      return function(name) {
        var id;
        id = idSeed++;
        return {
          id: function() {
            return id;
          },
          name: function() {
            return name;
          }
        };
      };
    });
  })("amo.minmax.Player");

}).call(this);

//# sourceMappingURL=player.js.map
