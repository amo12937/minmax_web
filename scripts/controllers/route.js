(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName).config([
      "$routeProvider", "amo.minmax.module.Translator.transResolverProvider", function($routeProvider, transResolverProvider) {
        return $routeProvider.when("/", {
          templateUrl: "templates/minmax.html",
          controller: "" + moduleName + ".minmax",
          resolve: {
            trans: transResolverProvider.getResolver()
          }
        });
      }
    ]);
  })("amo.minmax.controllers");

}).call(this);

//# sourceMappingURL=route.js.map
