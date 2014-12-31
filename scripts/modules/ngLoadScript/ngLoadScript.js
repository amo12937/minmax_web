(function() {
  "use strict";
  (function(ng) {
    return ng.module("ngLoadScript", []).directive("script", function() {
      return {
        restrict: "E",
        scope: false,
        link: function(scope, elm, attr) {
          var code, f;
          if (attr.type !== "text/javascript-lazy") {
            return;
          }
          code = elm.text();
          f = new Function(code);
          return f();
        }
      };
    });
  })(angular);

}).call(this);

//# sourceMappingURL=ngLoadScript.js.map
