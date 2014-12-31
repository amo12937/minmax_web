(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName).factory("" + moduleName + ".api.GetRule", [
      "$http", "" + moduleName + ".config", function($http, config) {
        return function() {
          var self;
          return self = {
            getPath: function(name, ext) {
              if (ext == null) {
                ext = config.resourceExt;
              }
              return "" + config.resourceDir + name + ext;
            },
            request: function(name, ext) {
              return $http.get(self.getPath(name, ext));
            }
          };
        };
      }
    ]);
  })("amo.minmax.module.Translator");

}).call(this);

//# sourceMappingURL=getRule.js.map
