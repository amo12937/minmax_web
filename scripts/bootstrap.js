(function() {
  "use strict";
  angular.element(window.document).ready(function() {
    var e, p;
    try {
      return angular.bootstrap(window.document, ["amo.minmax.Main"]);
    } catch (_error) {
      e = _error;
      p = e.message.indexOf("?");
      console.log(decodeURIComponent(e.message.slice(p + 1)));
      return console.log(e);
    }
  });

}).call(this);

//# sourceMappingURL=bootstrap.js.map
